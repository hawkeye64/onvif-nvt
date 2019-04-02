const Util = require('./utils/util');

const URL = require('url-parse');

class Camera {
  constructor() {
    this.core = null;
    this.access = null;
    this.accessrules = null;
    this.action = null;
    this.analytics = null;
    this.credential = null;
    this.deviceio = null;
    this.display = null;
    this.door = null;
    this.events = null;
    this.imaging = null;
    this.media = null;
    this.media2 = null;
    this.ptz = null;
    this.receiver = null;
    this.recording = null;
    this.replay = null;
    this.schedule = null;
    this.search = null;
    this.security = null;
    this.snapshot = null;
    this.thermal = null;
    this.videoanalytics = null;
    this.rootPath = null;
    this.serviceAddress = null;
    this.timeDiff = 0;
    this.address = null;
    this.port = null;
    this.username = null;
    this.password = null;
    this.deviceInformation = null;
    this.profileList = [];
    this.defaultProfile = null;
  }

  add(name) {
    switch (name) {
      case 'access':
        if (!this.access) {
          let Access = require('./modules/access');

          this.access = new Access();
        }

        break;

      case 'accessrules':
        if (!this.accessrules) {
          let AccessRules = require('./modules/accessrules');

          this.accessrules = new AccessRules();
        }

        break;

      case 'action':
        if (!this.action) {
          let Action = require('./modules/action');

          this.action = new Action();
        }

        break;

      case 'analytics':
        if (!this.analytics) {
          let Analytics = require('./modules/analytics');

          this.analytics = new Analytics();
        }

        break;

      case 'core':
        if (!this.core) {
          let Core = require('./modules/core');

          this.core = new Core();
          this.core.init(this.serviceAddress, this.username, this.password);
        }

        break;

      case 'credential':
        if (!this.credential) {
          let Credential = require('./modules/credential');

          this.credential = new Credential();
        }

        break;

      case 'deviceio':
        if (!this.deviceio) {
          let DeviceIO = require('./modules/deviceio');

          this.deviceio = new DeviceIO();
        }

        break;

      case 'display':
        if (!this.display) {
          let Display = require('./modules/display');

          this.display = new Display();
        }

        break;

      case 'door':
        if (!this.door) {
          let Door = require('./modules/door');

          this.door = new Door();
        }

        break;

      case 'events':
        if (!this.events) {
          let Events = require('./modules/events');

          this.events = new Events();
        }

        break;

      case 'imaging':
        if (!this.imaging) {
          let Imaging = require('./modules/imaging');

          this.imaging = new Imaging();
        }

        break;

      case 'media':
        if (!this.media) {
          let Media = require('./modules/media');

          this.media = new Media();
          this.media.init(this.timeDiff, this.serviceAddress, this.username, this.password);
        }

        break;

      case 'media2':
        if (!this.media2) {
          let Media2 = require('./modules/media2');

          this.media2 = new Media2();
        }

        break;

      case 'ptz':
        if (!this.ptz) {
          let Ptz = require('./modules/ptz');

          this.ptz = new Ptz();
        }

        break;

      case 'receiver':
        if (!this.receiver) {
          let Receiver = require('./modules/receiver');

          this.receiver = new Receiver();
        }

        break;

      case 'recording':
        if (!this.recording) {
          let Recording = require('./modules/recording');

          this.recording = new Recording();
        }

        break;

      case 'replay':
        if (!this.replay) {
          let Replay = require('./modules/replay');

          this.replay = new Replay();
        }

        break;

      case 'schedule':
        if (!this.schedule) {
          let Schedule = require('./modules/schedule');

          this.schedule = new Schedule();
        }

        break;

      case 'search':
        if (!this.search) {
          let Search = require('./modules/search');

          this.search = new Search();
        }

        break;

      case 'security':
        if (!this.security) {
          let Security = require('./modules/security');

          this.security = new Security();
        }

        break;

      case 'snapshot':
        if (!this.snapshot) {
          let Snapshot = require('./utils/snapshot');

          this.snapshot = new Snapshot();
          let defaultProfile = this.getDefaultProfile();

          if (defaultProfile) {
            let snapshotUri = defaultProfile.SnapshotUri.Uri;
            this.snapshot.init(snapshotUri, this.username, this.password);
          }
        }

        break;

      case 'thermal':
        if (!this.thermal) {
          let Thermal = require('./modules/thermal');

          this.thermal = new Thermal();
        }

        break;

      case 'videoanalytics':
        if (!this.videoanalytics) {
          let VideoAnalytics = require('./modules/videoanalytics');

          this.videoanalytics = new VideoAnalytics();
        }

        break;

      default:
        throw new Error(`Module '${name}' does not exist. Cannot add to Camera.`);
    }
  }

  connect(address, port, username, password, servicePath, callback) {
    return new Promise((resolve, reject) => {
      let errMsg = '';

      if (errMsg = Util.isInvalidValue(address, 'string')) {
        reject(new Error(`The "address" argument for connect is invalid: ` + errMsg));
        return;
      }

      port = port || 80;
      username = username || null;
      password = password || null;
      servicePath = servicePath || '/onvif/device_service';
      this.address = address;
      this.port = port;
      this.setAuth(username, password);
      let serviceAddress = 'http://' + address;

      if (port && port !== 80) {
        serviceAddress = serviceAddress + ':' + port;
      }

      this.rootPath = serviceAddress;
      serviceAddress = serviceAddress + servicePath;
      this.serviceAddress = new URL(serviceAddress);
      this.add('core');
      return this.coreGetSystemDateAndTime().then(() => {
        return this.coreGetServices();
      }).then(() => {
        return this.coreGetCapabilities();
      }).then(() => {
        return this.coreGetDeviceInformation();
      }).then(() => {
        return this.mediaGetProfiles();
      }).then(() => {
        return this.mediaGetStreamURI();
      }).then(() => {
        return this.mediaGetSnapshotUri();
      }).then(() => {
        return this.coreGetScopes();
      }).then(() => {
        let info = this.getInformation();
        resolve(info);
      }).catch(error => {
        reject(error);
      });
    });
  }

  setAuth(username, password) {
    if (typeof username === 'undefined') {
      this.username = null;
    } else {
      this.username = username;
    }

    if (typeof password === 'undefined') {
      this.password = null;
    } else {
      this.password = password;
    }
  }

  getInformation() {
    let o = this.deviceInformation;

    if (o) {
      return JSON.parse(JSON.stringify(o));
    } else {
      return null;
    }
  }

  getDefaultProfile() {
    return this.defaultProfile;
  }

  coreGetSystemDateAndTime() {
    return new Promise((resolve, reject) => {
      this.core.getSystemDateAndTime().then(results => {
        this.timeDiff = this.core.getTimeDiff();
        resolve();
      }).catch(error => {
        console.error(error);
        reject(error);
      });
    });
  }

  coreGetServices() {
    return new Promise((resolve, reject) => {
      this.core.getServices(true).then(results => {
        let response = results.data.GetServicesResponse;
        let services = response.Service;
        services.forEach(service => {
          this.checkForProxy(service);
          let namespace = service.Namespace;

          if (namespace === 'http://www.onvif.org/ver10/device/wsdl') {
            this.core.version = service.Version;
          } else if (namespace === 'http://www.onvif.org/ver10/media/wsdl') {
            this.add('media');

            if (this.media) {
              this.media.init(this.timeDiff, new URL(service.XAddr), this.username, this.password);
              this.media.version = service.Version;
            }
          } else if (namespace === 'http://www.onvif.org/ver10/events/wsdl') {
            this.add('events');

            if (this.events) {
              this.events.init(this.timeDiff, new URL(service.XAddr), this.username, this.password);
              this.events.version = service.Version;
            }
          } else if (namespace === 'http://www.onvif.org/ver20/ptz/wsdl') {
            this.add('ptz');

            if (this.ptz) {
              this.ptz.init(this.timeDiff, new URL(service.XAddr), this.username, this.password);
              this.ptz.version = service.Version;
            }
          } else if (namespace === 'http://www.onvif.org/ver20/imaging/wsdl') {
            this.add('imaging');

            if (this.imaging) {
              this.imaging.init(this.timeDiff, new URL(service.XAddr), this.username, this.password);
              this.imaging.version = service.Version;
            }
          } else if (namespace === 'http://www.onvif.org/ver10/deviceIO/wsdl') {
            this.add('deviceio');

            if (this.deviceio) {
              this.deviceio.init(this.timeDiff, new URL(service.XAddr), this.username, this.password);
              this.deviceio.version = service.Version;
            }
          } else if (namespace === 'http://www.onvif.org/ver20/analytics/wsdl') {
            this.add('analytics');

            if (this.analytics) {
              this.analytics.init(this.timeDiff, new URL(service.XAddr), this.username, this.password);
              this.analytics.version = service.Version;
            }
          }
        });
        resolve();
      }).catch(error => {
        console.error(error);
        resolve();
      });
    });
  }

  checkForProxy(service) {
    let xaddrPath = new URL(service.XAddr);

    if (xaddrPath.hostname === this.serviceAddress.hostname) {
      return;
    }

    service.XAddr = this.rootPath + xaddrPath.pathname;
  }

  coreGetCapabilities() {
    return new Promise((resolve, reject) => {
      this.core.getCapabilities().then(results => {
        let c = results['data']['GetCapabilitiesResponse']['Capabilities'];

        if (!c) {
          reject(new Error('Failed to initialize the device: No capabilities were found.'));
          return;
        }

        if ('Analytics' in c) {
          let analytics = c['Analytics'];
          this.checkForProxy(analytics);

          if (analytics && 'XAddr' in analytics) {
            if (!this.analytics) {
              this.add('analytics');

              if (this.analytics) {
                let serviceAddress = new URL(analytics['XAddr']);
                this.analytics.init(this.timeDiff, serviceAddress, this.username, this.password);
              }
            }

            if (this.analytics) {
              if ('RuleSupport' in analytics && analytics['RuleSupport'] === 'true') {
                this.analytics.ruleSupport = true;
              }

              if ('AnalyticsModuleSupport' in analytics && analytics['AnalyticsModuleSupport'] === 'true') {
                this.analytics.analyticsModuleSupport = true;
              }
            }
          }
        }

        if ('Events' in c) {
          let events = c['Events'];
          this.checkForProxy(events);

          if (events && 'XAddr' in events) {
            if (!this.events) {
              this.add('events');

              if (this.events) {
                let serviceAddress = new URL(events['XAddr']);
                this.events.init(this.timeDiff, serviceAddress, this.username, this.password);
              }
            }

            if (this.events) {
              if ('WSPullPointSupport' in events && events['WSPullPointSupport'] === 'true') {
                this.analytics.wsPullPointSupport = true;
              }

              if ('WSSubscriptionPolicySupport' in events && events['WSSubscriptionPolicySupport'] === 'true') {
                this.analytics.wsSubscriptionPolicySupport = true;
              }
            }
          }
        }

        if ('Imaging' in c) {
          let imaging = c['Imaging'];
          this.checkForProxy(imaging);

          if (imaging && 'XAddr' in imaging) {
            if (!this.imaging) {
              this.add('imaging');

              if (this.imaging) {
                let serviceAddress = new URL(imaging['XAddr']);
                this.imaging.init(this.timeDiff, serviceAddress, this.username, this.password);
              }
            }
          }
        }

        if ('Media' in c) {
          let media = c['Media'];
          this.checkForProxy(media);

          if (media && 'XAddr' in media) {
            if (!this.media) {
              this.add('media');

              if (this.media) {
                let serviceAddress = new URL(media['XAddr']);
                this.media.init(this.timeDiff, serviceAddress, this.username, this.password);
              }
            }
          }
        }

        if ('PTZ' in c) {
          let ptz = c['PTZ'];
          this.checkForProxy(ptz);

          if (ptz && 'XAddr' in ptz) {
            if (!this.ptz) {
              this.add('ptz');

              if (this.ptz) {
                let serviceAddress = new URL(ptz['XAddr']);
                this.ptz.init(this.timeDiff, serviceAddress, this.username, this.password);
              }
            }
          }
        }

        resolve();
      }).catch(error => {
        console.error(error);
        reject(error);
      });
    });
  }

  coreGetDeviceInformation() {
    return new Promise((resolve, reject) => {
      this.core.getDeviceInformation().then(results => {
        this.deviceInformation = results['data']['GetDeviceInformationResponse'];
        resolve();
      }).catch(error => {
        console.error(error);
        reject(error);
      });
    });
  }

  coreGetScopes() {
    return new Promise((resolve, reject) => {
      this.core.getScopes().then(results => {
        let scopes = results['data']['GetScopesResponse']['Scopes'];
        this.deviceInformation.Ptz = false;
        scopes.forEach(scope => {
          let s = scope['ScopeItem'];

          if (s.indexOf('onvif://www.onvif.org/hardware/') === 0) {
            let hardware = s.split('/').pop();
            this.deviceInformation.Hardware = hardware;
          } else if (s.indexOf('onvif://www.onvif.org/type/Streaming') === 0) {
            this.deviceInformation.Streaming = true;
          } else if (s.indexOf('onvif://www.onvif.org/type/video_encoder') === 0) {
            this.deviceInformation.VideoEncoder = true;
          } else if (s.indexOf('onvif://www.onvif.org/type/audio_encoder') === 0) {
            this.deviceInformation.AudiooEncoder = true;
          } else if (s.indexOf('onvif://www.onvif.org/type/ptz') === 0) {
            this.deviceInformation.Ptz = true;
          } else if (s.indexOf('onvif://www.onvif.org/Profile/S') === 0) {
            this.deviceInformation.ProfileS = true;
          } else if (s.indexOf('onvif://www.onvif.org/Profile/C') === 0) {
            this.deviceInformation.ProfileC = true;
          } else if (s.indexOf('onvif://www.onvif.org/Profile/G') === 0) {
            this.deviceInformation.ProfileG = true;
          } else if (s.indexOf('onvif://www.onvif.org/Profile/Q') === 0) {
            this.deviceInformation.ProfileQ = true;
          } else if (s.indexOf('onvif://www.onvif.org/Profile/A') === 0) {
            this.deviceInformation.ProfileA = true;
          } else if (s.indexOf('onvif://www.onvif.org/Profile/T') === 0) {
            this.deviceInformation.ProfileT = true;
          } else if (s.indexOf('onvif://www.onvif.org/location/country/') === 0) {
            let country = s.split('/').pop();
            this.deviceInformation.Country = country;
          } else if (s.indexOf('onvif://www.onvif.org/location/city/') === 0) {
            let city = s.split('/').pop();
            this.deviceInformation.City = city;
          } else if (s.indexOf('onvif://www.onvif.org/name/') === 0) {
            let name = s.split('/').pop();
            name = name.replace(/_/g, ' ');
            this.deviceInformation.Name = name;
          }
        });
        resolve();
      }).catch(error => {
        console.error(error);
        reject(error);
      });
    });
  }

  mediaGetProfiles() {
    return new Promise((resolve, reject) => {
      this.media.getProfiles().then(results => {
        let profiles = results['data']['GetProfilesResponse']['Profiles'];

        if (!profiles) {
          reject(new Error('Failed to initialize the device: The targeted device does not any media profiles.'));
          return;
        }

        let profileList = this.parseProfiles(profiles);
        this.profileList = this.profileList.concat(profileList);
        resolve();
      }).catch(error => {
        console.error(error);
        reject(error);
      });
    });
  }

  parseProfiles(profiles) {
    let profileList = [];
    profiles.forEach(profile => {
      profileList.push(profile);

      if (!this.defaultProfile) {
        this.defaultProfile = profile;

        if (this.ptz) {
          this.ptz.setDefaultProfileToken(profile.$.token);
        }
      }
    });
    return profileList;
  }

  getProfiles() {
    return this.profileList;
  }

  mediaGetStreamURI() {
    return new Promise((resolve, reject) => {
      let protocols = ['UDP', 'HTTP', 'RTSP'];
      let profileIndex = 0;
      let protocolIndex = 0;

      let getStreamUri = () => {
        let profile = this.profileList[profileIndex];

        if (profile) {
          let protocol = protocols[protocolIndex];

          if (protocol) {
            let token = profile['$']['token'];
            this.media.getStreamUri('RTP-Unicast', protocol, token).then(results => {
              profile.StreamUri = results['data']['GetStreamUriResponse']['MediaUri'];
              ++protocolIndex;
              getStreamUri();
            }).catch(error => {
              console.error(error);
              ++protocolIndex;
              getStreamUri();
            });
          } else {
            ++profileIndex;
            protocolIndex = 0;
            getStreamUri();
          }
        } else {
          resolve();
        }
      };

      getStreamUri();
    });
  }

  mediaGetSnapshotUri() {
    return new Promise((resolve, reject) => {
      let profileIndex = 0;

      let getSnapshotUri = () => {
        let profile = this.profileList[profileIndex];

        if (profile) {
          this.media.getSnapshotUri(profile['$']['token']).then(results => {
            try {
              let service = {};
              service.XAddr = results['data']['GetSnapshotUriResponse']['MediaUri']['Uri'];
              this.checkForProxy(service);
              profile.SnapshotUri = results['data']['GetSnapshotUriResponse']['MediaUri'];
              profile.SnapshotUri['Uri'] = service.XAddr;
            } catch (e) {}

            ++profileIndex;
            getSnapshotUri();
          }).catch(error => {
            console.error(error);
            ++profileIndex;
            getSnapshotUri();
          });
        } else {
          resolve();
        }
      };

      getSnapshotUri();
    });
  }

}

module.exports = Camera;