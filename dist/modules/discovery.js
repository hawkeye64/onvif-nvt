const Util = require('../utils/util');

const Soap = require('../utils/soap');

const dgram = require('dgram');

class Discovery {
  constructor() {
    this.soap = new Soap();
    this._MULTICAST_ADDRESS = '239.255.255.250';
    this._PORT = 3702;
    this._DISCOVERY_INTERVAL = 150;
    this._DISCOVERY_RETRY_MAX = 3;
    this._DISCOVERY_WAIT = 3000;
    this._udp = null;
    this._discoveryIntervalTimer = null;
    this._discoveryWaitTimer = null;
  }

  startProbe(callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for startProbe is invalid:' + errMsg));
          return;
        }
      }

      this._devices = {};
      this._udp = dgram.createSocket('udp4');

      this._udp.once('error', error => {
        reject(error);
      });

      this._udp.on('message', (buf, deviceInfo) => {
        this.soap.parse(buf.toString()).then(results => {
          this.parseResult(results, deviceInfo);
        }).catch(error => {
          console.error(error);
        });
      });

      this._udp.bind(() => {
        this._udp.removeAllListeners('error');

        this._sendProbe().then(() => {}).catch(error => {
          reject(error);
        });

        this._discoveryWaitTimer = setTimeout(() => {
          this.stopProbe().then(() => {
            const deviceList = [];
            Object.keys(this._devices).forEach(urn => {
              deviceList.push(this._devices[urn]);
            });
            resolve(deviceList);
          }).catch(error => {
            reject(error);
          });
        }, this._DISCOVERY_WAIT);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(deviceList => {
        callback(null, deviceList);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  stopProbe(callback) {
    if (this._discoveryIntervalTimer !== null) {
      clearTimeout(this._discoveryIntervalTimer);
      this._discoveryIntervalTimer = null;
    }

    if (this._discoveryWaitTimer !== null) {
      clearTimeout(this._discoveryWaitTimer);
      this._discoveryWaitTimer = null;
    }

    const promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (typeof callback !== 'undefined' && callback !== null) {
        if (errMsg = Util.isInvalidValue(callback, 'function')) {
          reject(new Error('The "callback" argument for stopProbe is invalid:' + errMsg));
          return;
        }
      }

      if (this._udp) {
        this._udp.close(() => {
          if (this._udp) {
            this._udp.unref();
          }

          this._udp = null;
          resolve();
        });
      } else {
        resolve();
      }
    });

    if (Util.isValidCallback(callback)) {
      promise.then(() => {
        callback(null);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

  _sendProbe(callback) {
    let soapTemplate = '';
    soapTemplate += '<?xml version="1.0" encoding="UTF-8"?>';
    soapTemplate += '<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing">';
    soapTemplate += '  <s:Header>';
    soapTemplate += '    <a:Action s:mustUnderstand="1">http://schemas.xmlsoap.org/ws/2005/04/discovery/Probe</a:Action>';
    soapTemplate += '    <a:MessageID>uuid:__uuid__</a:MessageID>';
    soapTemplate += '    <a:ReplyTo>';
    soapTemplate += '      <a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address>';
    soapTemplate += '    </a:ReplyTo>';
    soapTemplate += '    <a:To s:mustUnderstand="1">urn:schemas-xmlsoap-org:ws:2005:04:discovery</a:To>';
    soapTemplate += '  </s:Header>';
    soapTemplate += '  <s:Body>';
    soapTemplate += '    <Probe xmlns="http://schemas.xmlsoap.org/ws/2005/04/discovery">';
    soapTemplate += '      <d:Types xmlns:d="http://schemas.xmlsoap.org/ws/2005/04/discovery" xmlns:dp0="http://www.onvif.org/ver10/network/wsdl">dp0:__type__</d:Types>';
    soapTemplate += '    </Probe>';
    soapTemplate += '  </s:Body>';
    soapTemplate += '</s:Envelope>';
    soapTemplate = soapTemplate.replace(/\>\s+\</g, '><');
    soapTemplate = soapTemplate.replace(/\s+/, ' ');
    const soapSet = [];
    ['NetworkVideoTransmitter', 'Device', 'NetworkVideoDisplay'].forEach(type => {
      let s = soapTemplate;
      s = s.replace('__type__', type);
      s = s.replace('__uuid__', Util.createUuidV4());
      soapSet.push(s);
    });
    const soapList = [];

    for (let i = 0; i < this._DISCOVERY_RETRY_MAX; i++) {
      soapSet.forEach(s => {
        soapList.push(s);
      });
    }

    const promise = new Promise((resolve, reject) => {
      const send = () => {
        if (this._udp) {
          const soapEnvelope = soapList.shift();

          if (soapEnvelope) {
            const buf = Buffer.from(soapEnvelope, 'utf8');

            this._udp.send(buf, 0, buf.length, this._PORT, this._MULTICAST_ADDRESS, (error, bytes) => {
              if (error) {
                console.error(error);
              }

              this._discoveryIntervalTimer = setTimeout(() => {
                send();
              }, this._DISCOVERY_INTERVAL);
            });
          } else {
            resolve();
          }
        } else {
          reject(new Error('No UDP connection is available. The init() method might not be called yet.'));
        }
      };

      send();
    });
    return promise;
  }

  parseResult(results, deviceInfo) {
    const parsed = results.parsed;
    let urn = '';
    const address = deviceInfo.address;
    let service = '';
    let xaddrs = [];
    let scopes = [];
    let types = '';
    let probe = {};

    try {
      if ('Body' in parsed) {
        const body = parsed.Body;

        if ('ProbeMatches' in body) {
          const probeMatches = body.ProbeMatches;

          if (probeMatches !== undefined) {
            if ('ProbeMatch' in probeMatches) {
              const probeMatch = probeMatches.ProbeMatch;
              urn = probeMatch.EndpointReference.Address;
              xaddrs = probeMatch.XAddrs.split(/\s+/);

              if (xaddrs.length > 1) {
                xaddrs.forEach(addr => {
                  const index = addr.indexOf(deviceInfo.address);

                  if (index !== -1) {
                    service = addr;
                  }
                });
              } else {
                service = xaddrs[0];
              }

              if (typeof probeMatch.Scopes === 'string') {
                scopes = probeMatch.Scopes.split(/\s+/);
              } else if (typeof probeMatch.Scopes === 'object' && typeof probeMatch.Scopes._ === 'string') {
                scopes = probeMatch.Scopes._.split(/\s+/);
              }

              if (typeof probeMatch.Types === 'string') {
                types = probeMatch.Types.split(/\s+/);
              } else if (typeof probeMatch.Types === 'object' && typeof probeMatch.Types._ === 'string') {
                  types = probeMatch.Types._.split(/\s+/);
                }
            }
          }
        }
      }
    } catch (e) {
      return null;
    }

    if (urn && xaddrs.length > 0 && scopes.length > 0) {
      if (!this._devices[urn]) {
        let name = '';
        let hardware = '';
        let location = '';
        scopes.forEach(s => {
          if (s.indexOf('onvif://www.onvif.org/hardware/') === 0) {
            hardware = s.split('/').pop();
          } else if (s.indexOf('onvif://www.onvif.org/location/') === 0) {
            location = s.split('/').pop();
          } else if (s.indexOf('onvif://www.onvif.org/name/') === 0) {
            name = s.split('/').pop();
            name = name.replace(/_/g, ' ');
          }
        });
        probe = {
          urn: urn,
          name: name,
          address: address,
          service: service,
          hardware: hardware,
          location: location,
          types: types,
          xaddrs: xaddrs,
          scopes: scopes
        };
        this._devices[urn] = probe;
      }
    }

    return probe;
  }

}

module.exports = Discovery;