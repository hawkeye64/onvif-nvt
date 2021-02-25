const Util = require('./utils/util')
const URL = require('url-parse')

const MODULE_MAP = {
  access: './modules/access',
  accessrules: './modules/accessrules',
  action: './modules/action',
  analytics: './modules/analytics',
  core: './modules/core',
  credential: './modules/credential',
  deviceio: './modules/deviceio',
  display: './modules/display',
  door: './modules/door',
  events: './modules/events',
  imaging: './modules/imaging',
  media: './modules/media',
  media2: './modules/media2',
  ptz: './modules/ptz',
  receiver: './modules/receiver',
  recording: './modules/recording',
  replay: './modules/replay',
  schedule: './modules/schedule',
  search: './modules/search',
  security: './modules/security',
  snapshot: './utils/snapshot',
  thermal: './modules/thermal',
  videoanalytics: './modules/videoanalytics'
}

const MODULE_MAP_AFTER = {
  core: function () {
    this.core.init(this.serviceAddress, this.username, this.password)
  },
  media: function () {
    this.media.init(this.timeDiff, this.serviceAddress, this.username, this.password)
  },
  snapshot: function () {
    const defaultProfile = this.getDefaultProfile()
    if (defaultProfile) {
      const snapshotUri = defaultProfile.SnapshotUri.Uri
      this.snapshot.init(snapshotUri, this.username, this.password)
    }
  }
}

/**
 * Wrapper class for all onvif modules to manage an Onvif device (camera).
 */
class Camera {
  constructor () {
    this.core = null

    this.access = null
    this.accessrules = null
    this.action = null
    this.analytics = null
    this.credential = null
    this.deviceio = null
    this.display = null
    this.door = null
    this.events = null
    this.imaging = null
    this.media = null // Onvif 1.x
    this.media2 = null // Onvif 2.x
    this.ptz = null
    this.receiver = null
    this.recording = null
    this.replay = null
    this.schedule = null
    this.search = null
    this.security = null
    this.snapshot = null
    this.thermal = null
    this.videoanalytics = null

    this.rootPath = null
    this.serviceAddress = null
    this.timeDiff = 0
    this.address = null
    this.port = null
    this.username = null
    this.password = null

    this.deviceInformation = null
    this.profileList = []
    this.defaultProfile = null
  }

  /**
   * Add a module to Camera. The available modules are:
   * <ul>
   * <li>access</li>
   * <li>accessrules</li>
   * <li>action</li>
   * <li>analytics - automatically added based on capabilities</li>
   * <li>core - automatically added</li>
   * <li>credential</li>
   * <li>deviceio</li>
   * <li>display</li>
   * <li>door</li>
   * <li>events - automatically added based on capabilities</li>
   * <li>imaging - automatically added based on capabilities</li>
   * <li>media - automatically added based on capabilities</li>
   * <li>media2</li>
   * <li>ptz - automatically added based on capabilities</li>
   * <li>receiver</li>
   * <li>recording</li>
   * <li>replay</li>
   * <li>schedule</li>
   * <li>search</li>
   * <li>security</li>
   * <li>snapshot</li>
   * <li>thermal</li>
   * <li>videoanalytics</li>
   * </ul>
   * @param {string} name The name of the module.
   */
  add (name) {
    const mod = MODULE_MAP[name]
    if (!MODULE_MAP[name]) {
      throw new Error(`Module '${name}' does not exist. Cannot add to Camera.`)
    }
    if (this[name]) {
      return
    }
    const Inst = require(mod)
    const after = MODULE_MAP_AFTER[name] || (() => {})

    this[name] = new Inst()
    after.call(this)
  }

  /**
   * Connect with the specified camera
   * @param {string} address The camera's address
   * @param {integer=} port Optional port (80 used if this is null)
   * @param {string=} username The username for the account on the camera. This is optional if your camera does not require a username.
   * @param {string=} password The password for the account on the camera. This is optional if your camera does not require a password.
   * @param {string=} servicePath The service path for the camera. If null or 'undefined' the default path according to the ONVIF spec will be used.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  connect (address, port, username, password, servicePath, callback) {
    return new Promise((resolve, reject) => {
      // check for valid address
      let errMsg = ''
      if ((errMsg = Util.isInvalidValue(address, 'string'))) {
        reject(new Error('The "address" argument for connect is invalid: ' + errMsg))
        return
      }

      // provide defaults if not provided
      port = port || 80
      username = username || null
      password = password || null
      servicePath = servicePath || '/onvif/device_service'

      this.address = address
      this.port = port

      this.setAuth(username, password)

      // set up the service address
      let serviceAddress = 'http://' + address
      if (port && port !== 80) {
        serviceAddress = serviceAddress + ':' + port
      }
      this.rootPath = serviceAddress
      serviceAddress = serviceAddress + servicePath

      this.serviceAddress = new URL(serviceAddress)

      // add core module
      this.add('core')

      return this.coreGetSystemDateAndTime()
        .then(() => {
          return this.coreGetServices()
        })
        .then(() => {
          return this.coreGetCapabilities()
        })
        .then(() => {
          return this.coreGetDeviceInformation()
        })
        .then(() => {
          return this.mediaGetProfiles()
        })
        .then(() => {
          return this.mediaGetStreamURI()
        })
        .then(() => {
          return this.mediaGetSnapshotUri()
        })
        .then(() => {
          return this.coreGetScopes()
        })
        .then(() => {
          const info = this.getInformation()
          resolve(info)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  /**
   * Used to change or remove the auth information for the camera.
   * @param {string=} username The username for the account on the camera. This is optional if your camera does not require a username.
   * @param {string=} password The password for the account on the camera. This is optional if your camera does not require a password.
   */
  setAuth (username, password) {
    if (typeof username === 'undefined') {
      this.username = null
    }
    else {
      this.username = username
    }
    if (typeof password === 'undefined') {
      this.password = null
    }
    else {
      this.password = password
    }
  }

  /**
   * Returns the ONVIF device's informaton. Available after connection.
  */
  getInformation () {
    const o = this.deviceInformation
    if (o) {
      return JSON.parse(JSON.stringify(o))
    }
    else {
      return null
    }
  }

  /**
   * Returns the default profile that will be used when one is not supplied to functions that require it. Available after connection.
  */
  getDefaultProfile () {
    return this.defaultProfile
  }

  coreGetSystemDateAndTime () {
    return new Promise((resolve, reject) => {
      this.core.getSystemDateAndTime()
        .then(results => {
          this.timeDiff = this.core.getTimeDiff()
          resolve()
        })
        .catch(error => {
          console.error(error)
          reject(error)
        })
    })
  }

  coreGetServices () {
    return new Promise((resolve, reject) => {
      this.core.getServices(true)
        .then(results => {
          const response = results.data.GetServicesResponse
          const services = response.Service

          // the appropriate modules will be automatically added
          // to camera based on the onvif device's services.
          // if GetServics is not supported, the GetCapabilities
          // fallback will be used.
          services.forEach(service => {
            this.checkForProxy(service)
            const namespace = service.Namespace
            if (namespace === 'http://www.onvif.org/ver10/device/wsdl') {
              this.core.version = service.Version
            }
            else if (namespace === 'http://www.onvif.org/ver10/media/wsdl') {
              this.add('media')
              if (this.media) {
                this.media.init(this.timeDiff, new URL(service.XAddr), this.username, this.password)
                this.media.version = service.Version
              }
            }
            else if (namespace === 'http://www.onvif.org/ver10/events/wsdl') {
              this.add('events')
              if (this.events) {
                this.events.init(this.timeDiff, new URL(service.XAddr), this.username, this.password)
                this.events.version = service.Version
              }
            }
            else if (namespace === 'http://www.onvif.org/ver20/ptz/wsdl') {
              this.add('ptz')
              if (this.ptz) {
                this.ptz.init(this.timeDiff, new URL(service.XAddr), this.username, this.password)
                this.ptz.version = service.Version
              }
            }
            else if (namespace === 'http://www.onvif.org/ver20/imaging/wsdl') {
              this.add('imaging')
              if (this.imaging) {
                this.imaging.init(this.timeDiff, new URL(service.XAddr), this.username, this.password)
                this.imaging.version = service.Version
              }
            }
            else if (namespace === 'http://www.onvif.org/ver10/deviceIO/wsdl') {
              this.add('deviceio')
              if (this.deviceio) {
                this.deviceio.init(this.timeDiff, new URL(service.XAddr), this.username, this.password)
                this.deviceio.version = service.Version
              }
            }
            else if (namespace === 'http://www.onvif.org/ver20/analytics/wsdl') {
              this.add('analytics')
              if (this.analytics) {
                this.analytics.init(this.timeDiff, new URL(service.XAddr), this.username, this.password)
                this.analytics.version = service.Version
              }
            }
          })
          resolve()
        })
        .catch(error => {
          console.error(error)
          // don't fail because this isn't supported by the camera
          // spec says to use fallback of GetCapabilities method.
          resolve()
        })
    })
  }

  // make sure the serviceAddress matches
  // if not, then we may be behind a proxy and it needs
  // do be dealt with
  checkForProxy (service) {
    const xaddrPath = new URL(service.XAddr)
    if (xaddrPath.hostname === this.serviceAddress.hostname) {
      // no proxy
      return
    }

    // build new path
    service.XAddr = this.rootPath + xaddrPath.pathname
  }

  coreGetCapabilities () {
    return new Promise((resolve, reject) => {
      this.core.getCapabilities()
        .then(results => {
          const c = results.data.GetCapabilitiesResponse.Capabilities
          if (!c) {
            reject(new Error('Failed to initialize the device: No capabilities were found.'))
            return
          }
          // the appropriate modules will be automatically added
          // to camera based on the onvif device's capabilities.
          if ('Analytics' in c) {
            const analytics = c.Analytics
            this.checkForProxy(analytics)
            if (analytics && 'XAddr' in analytics) {
              if (!this.analytics) {
                this.add('analytics')
                if (this.analytics) {
                  const serviceAddress = new URL(analytics.XAddr)
                  this.analytics.init(this.timeDiff, serviceAddress, this.username, this.password)
                }
              }
              if (this.analytics) {
                if ('RuleSupport' in analytics && analytics.RuleSupport === 'true') {
                  this.analytics.ruleSupport = true
                }
                if ('AnalyticsModuleSupport' in analytics && analytics.AnalyticsModuleSupport === 'true') {
                  this.analytics.analyticsModuleSupport = true
                }
              }
            }
          }
          if ('Events' in c) {
            const events = c.Events
            this.checkForProxy(events)
            if (events && 'XAddr' in events) {
              if (!this.events) {
                this.add('events')
                if (this.events) {
                  const serviceAddress = new URL(events.XAddr)
                  this.events.init(this.timeDiff, serviceAddress, this.username, this.password)
                }
              }
              if (this.events && this.analytics) {
                if ('WSPullPointSupport' in events && events.WSPullPointSupport === 'true') {
                  this.analytics.wsPullPointSupport = true
                }
                if ('WSSubscriptionPolicySupport' in events && events.WSSubscriptionPolicySupport === 'true') {
                  this.analytics.wsSubscriptionPolicySupport = true
                }
              }
            }
          }
          if ('Imaging' in c) {
            const imaging = c.Imaging
            this.checkForProxy(imaging)
            if (imaging && 'XAddr' in imaging) {
              if (!this.imaging) {
                this.add('imaging')
                if (this.imaging) {
                  const serviceAddress = new URL(imaging.XAddr)
                  this.imaging.init(this.timeDiff, serviceAddress, this.username, this.password)
                }
              }
            }
          }
          if ('Media' in c) {
            const media = c.Media
            this.checkForProxy(media)
            if (media && 'XAddr' in media) {
              if (!this.media) {
                this.add('media')
                if (this.media) {
                  const serviceAddress = new URL(media.XAddr)
                  this.media.init(this.timeDiff, serviceAddress, this.username, this.password)
                }
              }
            }
          }
          if ('PTZ' in c) {
            const ptz = c.PTZ
            this.checkForProxy(ptz)
            if (ptz && 'XAddr' in ptz) {
              if (!this.ptz) {
                this.add('ptz')
                if (this.ptz) {
                  const serviceAddress = new URL(ptz.XAddr)
                  this.ptz.init(this.timeDiff, serviceAddress, this.username, this.password)
                }
              }
            }
          }
          resolve()
        })
        .catch(error => {
          console.error(error)
          reject(error)
        })
    })
  }

  coreGetDeviceInformation () {
    return new Promise((resolve, reject) => {
      this.core.getDeviceInformation()
        .then(results => {
          this.deviceInformation = results.data.GetDeviceInformationResponse
          resolve()
        })
        .catch(error => {
          console.error(error)
          reject(error)
        })
    })
  }

  coreGetScopes () {
    return new Promise((resolve, reject) => {
      this.core.getScopes()
        .then(results => {
          const scopes = typeof results.data.GetScopesResponse.Scopes === 'undefined' || !Array.isArray(results.data.GetScopesResponse.Scopes) ? [] : results.data.GetScopesResponse.Scopes
          this.deviceInformation.Ptz = false
          scopes.forEach((scope) => {
            const s = scope.ScopeItem
            if (s.indexOf('onvif://www.onvif.org/hardware/') === 0) {
              const hardware = s.split('/').pop()
              this.deviceInformation.Hardware = hardware
            }
            else if (s.indexOf('onvif://www.onvif.org/type/Streaming') === 0) {
              this.deviceInformation.Streaming = true
            }
            else if (s.indexOf('onvif://www.onvif.org/type/video_encoder') === 0) {
              this.deviceInformation.VideoEncoder = true
            }
            else if (s.indexOf('onvif://www.onvif.org/type/audio_encoder') === 0) {
              this.deviceInformation.AudiooEncoder = true
            }
            else if (s.indexOf('onvif://www.onvif.org/type/ptz') === 0) {
              this.deviceInformation.Ptz = true
            }
            else if (s.indexOf('onvif://www.onvif.org/Profile/S') === 0) {
              this.deviceInformation.ProfileS = true
            }
            else if (s.indexOf('onvif://www.onvif.org/Profile/C') === 0) {
              this.deviceInformation.ProfileC = true
            }
            else if (s.indexOf('onvif://www.onvif.org/Profile/G') === 0) {
              this.deviceInformation.ProfileG = true
            }
            else if (s.indexOf('onvif://www.onvif.org/Profile/Q') === 0) {
              this.deviceInformation.ProfileQ = true
            }
            else if (s.indexOf('onvif://www.onvif.org/Profile/A') === 0) {
              this.deviceInformation.ProfileA = true
            }
            else if (s.indexOf('onvif://www.onvif.org/Profile/T') === 0) {
              this.deviceInformation.ProfileT = true
            }
            else if (s.indexOf('onvif://www.onvif.org/location/country/') === 0) {
              const country = s.split('/').pop()
              this.deviceInformation.Country = country
            }
            else if (s.indexOf('onvif://www.onvif.org/location/city/') === 0) {
              const city = s.split('/').pop()
              this.deviceInformation.City = city
            }
            else if (s.indexOf('onvif://www.onvif.org/name/') === 0) {
              let name = s.split('/').pop()
              name = name.replace(/_/g, ' ')
              this.deviceInformation.Name = name
            }
          })

          resolve()
        })
        .catch(error => {
          console.error(error)
          reject(error)
        })
    })
  }

  mediaGetProfiles () {
    return new Promise((resolve, reject) => {
      this.media.getProfiles()
        .then(results => {
          const profiles = results.data.GetProfilesResponse.Profiles
          if (!profiles) {
            reject(new Error('Failed to initialize the device: The targeted device does not any media profiles.'))
            return
          }
          const profileList = this.parseProfiles(profiles)
          this.profileList = this.profileList.concat(profileList)
          resolve()
        })
        .catch(error => {
          console.error(error)
          reject(error)
        })
    })
  }

  parseProfiles (profiles) {
    const profileList = []

    // When a single profile is given 'profiles' is the single profile
    if (!Array.isArray(profiles)) {
      profiles = [profiles]
    }

    profiles.forEach((profile) => {
      profileList.push(profile)
      if (!this.defaultProfile) {
        this.defaultProfile = profile
        if (this.ptz) {
          this.ptz.setDefaultProfileToken(profile.$.token)
        }
      }
    })

    return profileList
  }

  /**
   * Returns an array of profiles. Available after connection.
   * The profiles will contain media stream URIs and snapshot URIs for each profile.
  */
  getProfiles () {
    return this.profileList
  }

  mediaGetStreamURI () {
    return new Promise((resolve, reject) => {
      const protocols = ['UDP', 'HTTP', 'RTSP']
      let profileIndex = 0
      let protocolIndex = 0
      const getStreamUri = () => {
        const profile = this.profileList[profileIndex]
        if (profile) {
          const protocol = protocols[protocolIndex]
          if (protocol) {
            const token = profile.$.token
            this.media.getStreamUri('RTP-Unicast', protocol, token)
              .then(results => {
                profile.StreamUri = results.data.GetStreamUriResponse.MediaUri
                ++protocolIndex
                getStreamUri()
              })
              .catch(error => {
                console.error(error)
                ++protocolIndex
                getStreamUri()
              })
          }
          else {
            ++profileIndex
            protocolIndex = 0
            getStreamUri()
          }
        }
        else {
          resolve()
        }
      }
      getStreamUri()
    })
  }

  mediaGetSnapshotUri () {
    return new Promise((resolve, reject) => {
      let profileIndex = 0
      const getSnapshotUri = () => {
        const profile = this.profileList[profileIndex]
        if (profile) {
          // this.media.getSnapshotUri(profile['token'])
          this.media.getSnapshotUri(profile.$.token)
            .then(results => {
              try {
                const service = {}
                service.XAddr = results.data.GetSnapshotUriResponse.MediaUri.Uri
                this.checkForProxy(service)
                profile.SnapshotUri = results.data.GetSnapshotUriResponse.MediaUri
                profile.SnapshotUri.Uri = service.XAddr
              }
              catch (e) {}
              ++profileIndex
              getSnapshotUri()
            })
            .catch(error => {
              console.error(error)
              ++profileIndex
              getSnapshotUri()
            })
        }
        else {
          resolve()
        }
      }
      getSnapshotUri()
    })
  }
}

module.exports = Camera
