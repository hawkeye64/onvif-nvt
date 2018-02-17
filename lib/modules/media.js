const Soap = require('../utils/soap')
const Util = require('../utils/util')

/**
 * @class Media
 * <p>
 * {@link https://www.onvif.org/specs/srv/media/ONVIF-Media-Service-Spec-v1706.pdf}<br>
 * {@link https://www.onvif.org/ver10/media/wsdl/media.wsdl}<br>
 * </p>
 * <h3>Functions</h3>
 * createProfile,
 * {@link Media#getProfiles},
 * {@link Media#getProfile},
 * {@link Media#addVideoSourceConfiguration},
 * {@link Media#addVideoEncoderConfiguration},
 * {@link Media#addAudioSourceConfiguration},
 * {@link Media#addAudioEncoderConfiguration},
 * {@link Media#addPTZConfiguration},
 * {@link Media#addVideoAnalyticsConfiguration},
 * {@link Media#addMetadataConfiguration},
 * {@link Media#addAudioOutputConfiguration},
 * {@link Media#addAudioDecoderConfiguration},
 * removeVideoSourceConfiguration,
 * removeVideoEncoderConfiguration,
 * removeAudioSourceConfiguration,
 * removeAudioEncoderConfiguration,
 * removePTZConfiguration,
 * removeVideoAnalyticsConfiguration,
 * removeMetadataConfiguration,
 * removeAudioOutputConfiguration,
 * removeAudioDecoderConfiguration,
 * deleteProfile,
 * {@link Media#getVideoSources},
 * {@link Media#getVideoSourceConfigurations},
 * getVideoSourceConfiguration,
 * getCompatibleVideoSourceConfigurations,
 * getVideoSourceConfigurationOptions,
 * setVideoSourceConfiguration,
 * {@link Media#getVideoEncoderConfigurations},
 * getVideoEncoderConfiguration,
 * getCompatibleVideoEncoderConfigurations,
 * getVideoEncoderConfigurationOptions,
 * setVideoEncoderConfiguration,
 * getGuaranteedNumberOfVideoEncoderInstances,
 * {@link Media#getAudioSources},
 * {@link Media#getAudioSourceConfigurations},
 * getAudioSourceConfiguration,
 * getCompatibleAudioSourceConfigurations,
 * getAudioSourceConfigurationOptions,
 * setAudioSourceConfiguration,
 * {@link Media#getAudioEncoderConfigurations},
 * getAudioEncoderConfiguration,
 * getCompatibleAudioEncoderConfigurations,
 * getAudioEncoderConfigurationOptions,
 * setAudioEncoderConfiguration,
 * {@link Media#getVideoAnalyticsConfigurations},
 * getVideoAnalyticsConfiguration,
 * getCompatibleVideoAnalyticsConfigurations,
 * setVideoAnalyticsConfiguration,
 * {@link Media#getMetadataConfigurations},
 * getMetadataConfiguration,
 * getCompatibleMetadataConfigurations,
 * getMetadataConfigurationOptions,
 * setMetadataConfiguration,
 * {@link Media#getAudioOutputs},
 * {@link Media#getAudioOutputConfigurations},
 * getAudioOutputConfiguration,
 * getCompatibleAudioOutputConfigurations,
 * getAudioOutputConfigurationOptions,
 * setAudioOutputConfiguration,
 * {@link Media#getAudioDecoderConfigurations},
 * getAudioDecoderConfiguration,
 * getCompatibleAudioDecoderConfigurations,
 * getAudioDecoderConfigurationOptions,
 * setAudioDecoderConfiguration,
 * {@link Media#getStreamUri},
 * {@link Media#getSnapshotUri},
 * startMulticastStreaming,
 * stopMulticastStreaming,
 * setSynchronizationPoint,
 * getVideoSourceModes,
 * setVideoSourceMode,
 * createOSD,
 * deleteOSD,
 * getOSDs,
 * getOSD,
 * setOSD,
 * getOSDOptions
 * <br><br>
 * <h3>Overview</h3>
 */
class Media {
  constructor () {
    this.timeDiff = 0
    this.serviceAddress = null
    this.username = null
    this.password = null

    this.namespaceAttributes = [
      'xmlns:env="http://www.w3.org/2003/05/soap-envelope "',
      'xmlns:ter="http://www.onvif.org/ver10/error"',
      'xmlns:xs="http://www.w3.org/2001/XMLSchema"',
      'xmlns:tt="http://www.onvif.org/ver10/schema"',
      'xmlns:trt="http://www.onvif.org/ver10/media/wsdl"'
    ]
  }

  /**
   * Call this function directly after instantiating a Media object.
   * @param {number} timeDiff The onvif device's time difference.
   * @param {object} serviceAddress An url object from url package - require('url').
   * @param {string=} username Optional only if the device does NOT have a user.
   * @param {string=} password Optional only if the device does NOT have a password.
   */
  init (timeDiff, serviceAddress, username, password) {
    this.timeDiff = timeDiff
    this.serviceAddress = serviceAddress
    this.username = username
    this.password = password
  }

  /**
   * Private function for creating a SOAP request.
   * @param {string} body The body of the xml.
   */
  createRequest (body) {
    let soapEnvelope = Soap.createRequest({
      'body': body,
      'xmlns': this.namespaceAttributes,
      'diff': this.timeDiff,
      'username': this.username,
      'password': this.password
    })
    return soapEnvelope
  };

  buildRequest (methodName, xml, callback) {
    let promise = new Promise((resolve, reject) => {
      let soapBody = ''
      if (typeof xml === 'undefined' || xml === null) {
        soapBody += `<trt:${methodName}/>`
      }
      else {
        soapBody += `<trt:${methodName}>`
        soapBody += xml
        soapBody += `</trt:${methodName}>`
      }
      let soapEnvelope = this.createRequest(soapBody)
      return Soap.makeRequest(this.serviceAddress, methodName, soapEnvelope)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (callback) {
      promise.then(results => {
        callback(null, results)
      }).catch(error => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  addConfiguration (methodName, profileToken, configurationToken, callback) {
    let promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error(`The "profileToken" argument for ${methodName} is invalid: ` + errMsg))
        return
      }

      if ((errMsg = Util.isInvalidValue(configurationToken, 'string'))) {
        reject(new Error(`The "ConfigurationToken" argument for ${methodName} is invalid: ` + errMsg))
        return
      }

      let soapBody = ''
      soapBody += '<trt:ProfileToken>' + profileToken + '</trt:ProfileToken>'
      soapBody += '<trt:ConfigurationToken>' + configurationToken + '</trt:ConfigurationToken>'

      this.buildRequest(methodName, soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (callback) {
      promise.then(results => {
        callback(null, results)
      }).catch(error => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  // ---------------------------------------------
  // Media API
  // ---------------------------------------------

  createProfile () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * Any endpoint can ask for the existing media profiles of a device using the GetProfiles
   * command. Pre-configured or dynamically configured profiles can be retrieved using this
   * command. This command lists all configured profiles in a device. The client does not need to
   * know the media profile in order to use the command. The device shall support the retrieval of
   * media profiles through the GetProfiles command.<br>
   * A device shall include the “fixed” attribute in all the returned Profile elements.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getProfiles (callback) {
    return this.buildRequest('GetProfiles', null, callback)
  }

  /**
   * If the profile token is already known, a profile can be fetched through the GetProfile command.
   * The device shall support the retrieval of a specific media profile through the GetProfile
   * command.<br>
   * A device shall include the “fixed” attribute in the returned Profile element.
   * @param {string} profileToken this command requests a specific profile
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getProfile (profileToken, callback) {
    let promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error('The "profileToken" argument for getProfile is invalid: ' + errMsg))
        return
      }

      let soapBody = '<trt:ProfileToken>' + profileToken + '</trt:ProfileToken>'
      this.buildRequest('GetProfile', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (callback) {
      promise.then(results => {
        callback(null, results)
      }).catch(error => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  /**
   * This operation adds a VideoSourceConfiguration to an existing media profile. If such a
   * configuration exists in the media profile, it will be replaced. The change shall be persistent.<br>
   * The device shall support addition of a video source configuration to a profile through the
   * AddVideoSourceConfiguration command.
   * @param {string} profileToken Reference to the profile where the configuration should be added
   * @param {string} configurationToken Contains a reference to the VideoSourceConfiguration to add
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  addVideoSourceConfiguration (profileToken, configurationToken, callback) {
    return this.addConfiguration('AddVideoSourceConfiguration', profileToken, configurationToken, callback)
  }

  /**
   * This operation adds a VideoEncoderConfiguration to an existing media profile. If a configuration exists in the media profile, it will be replaced. The change shall be persistent. A device shall support adding a compatible VideoEncoderConfiguration to a Profile containing a VideoSourceConfiguration and shall support streaming video data of such a profile.
   * @param {string} profileToken Reference to the profile where the configuration should be added
   * @param {string} configurationToken Contains a reference to the VideoEncoderConfiguration to add
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  addVideoEncoderConfiguration (profileToken, configurationToken, callback) {
    return this.addConfiguration('AddVideoEncoderConfiguration', profileToken, configurationToken, callback)
  }

  /**
   * This operation adds an AudioSourceConfiguration to an existing media profile. If a configuration exists in the media profile, it will be replaced. The change shall be persistent.
   * @param {string} profileToken Reference to the profile where the configuration should be added
   * @param {string} configurationToken Contains a reference to the AudioSourceConfiguration to add
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  addAudioSourceConfiguration (profileToken, configurationToken, callback) {
    return this.addConfiguration('AddAudioSourceConfiguration', profileToken, configurationToken, callback)
  }

  /**
   * This operation adds an AudioEncoderConfiguration to an existing media profile. If a configuration exists in the media profile, it will be replaced. The change shall be persistent. A device shall support adding a compatible AudioEncoderConfiguration to a profile containing an AudioSourceConfiguration and shall support streaming audio data of such a profile.
   * @param {string} profileToken Reference to the profile where the configuration should be added.
   * @param {string} configurationToken Contains a reference to the AudioEncoderConfiguration to add.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  addAudioEncoderConfiguration (profileToken, configurationToken, callback) {
    return this.addConfiguration('AddAudioEncoderConfiguration', profileToken, configurationToken, callback)
  }

  /**
   * This operation adds a PTZConfiguration to an existing media profile. If a configuration exists in the media profile, it will be replaced. The change shall be persistent. Adding a PTZConfiguration to a media profile means that streams using that media profile can contain PTZ status (in the metadata), and that the media profile can be used for controlling PTZ movement.
   * @param {string} profileToken Reference to the profile where the configuration should be added.
   * @param {string} configurationToken Contains a reference to the PTZConfiguration to add.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  addPTZConfiguration (profileToken, configurationToken, callback) {
    return this.addConfiguration('AddPTZConfiguration', profileToken, configurationToken, callback)
  }

  /**
   * This operation adds a VideoAnalytics configuration to an existing media profile. If a configuration exists in the media profile, it will be replaced. The change shall be persistent. Adding a VideoAnalyticsConfiguration to a media profile means that streams using that media profile can contain video analytics data (in the metadata) as defined by the submitted configuration reference. A profile containing only a video analytics configuration but no video source configuration is incomplete. Therefore, a client should first add a video source configuration to a profile before adding a video analytics configuration. The device can deny adding of a video analytics configuration before a video source configuration.
   * @param {string} profileToken Reference to the profile where the configuration should be added.
   * @param {string} configurationToken Contains a reference to the VideoAnalyticsConfiguration to add.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  addVideoAnalyticsConfiguration (profileToken, configurationToken, callback) {
    return this.addConfiguration('AddVideoAnalyticsConfiguration', profileToken, configurationToken, callback)
  }

  /**
   * This operation adds a Metadata configuration to an existing media profile. If a configuration exists in the media profile, it will be replaced. The change shall be persistent. Adding a MetadataConfiguration to a Profile means that streams using that profile contain metadata. Metadata can consist of events, PTZ status, and/or video analytics data.
   * @param {string} profileToken Reference to the profile where the configuration should be added.
   * @param {string} configurationToken Contains a reference to the MetadataConfiguration to add.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  addMetadataConfiguration (profileToken, configurationToken, callback) {
    return this.addConfiguration('AddMetadataConfiguration', profileToken, configurationToken, callback)
  }

  /**
   * This operation adds an AudioOutputConfiguration to an existing media profile. If a configuration exists in the media profile, it will be replaced. The change shall be persistent.
   * @param {string} profileToken Reference to the profile where the configuration should be added.
   * @param {string} configurationToken Contains a reference to the AudioOutputConfiguration to add.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  addAudioOutputConfiguration (profileToken, configurationToken, callback) {
    return this.addConfiguration('AddAudioOutputConfiguration', profileToken, configurationToken, callback)
  }

  /**
   * This operation adds an AudioDecoderConfiguration to an existing media profile. If a configuration exists in the media profile, it shall be replaced. The change shall be persistent.
   * @param {string} profileToken Reference to the profile where the configuration should be added.
   * @param {string} configurationToken This element contains a reference to the AudioDecoderConfiguration to add.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  addAudioDecoderConfiguration (profileToken, configurationToken, callback) {
    return this.addConfiguration('AddAudioDecoderConfiguration', profileToken, configurationToken, callback)
  }

  removeVideoSourceConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removeVideoEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removeAudioSourceConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removeAudioEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removePTZConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removeVideoAnalyticsConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removeMetadataConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removeAudioOutputConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  removeAudioDecoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteProfile () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This command lists all available physical video inputs of the device.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getVideoSources (callback) {
    return this.buildRequest('GetVideoSources', null, callback)
  }

  /**
   * This operation lists all existing video source configurations for a device. The client need not know anything about the video source configurations in order to use the command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getVideoSourceConfigurations (callback) {
    return this.buildRequest('GetVideoSourceConfigurations', null, callback)
  }

  getVideoSourceConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCompatibleVideoSourceConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getVideoSourceConfigurationOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setVideoSourceConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation lists all existing video encoder configurations of a device. This command lists all configured video encoder configurations in a device. The client need not know anything apriori about the video encoder configurations in order to use the command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getVideoEncoderConfigurations (callback) {
    return this.buildRequest('GetVideoEncoderConfigurations', null, callback)
  }

  getVideoEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCompatibleVideoEncoderConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getVideoEncoderConfigurationOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setVideoEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getGuaranteedNumberOfVideoEncoderInstances () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This command lists all available physical audio inputs of the device.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getAudioSources (callback) {
    return this.buildRequest('GetAudioSources', null, callback)
  }

  /**
   * This operation lists all existing audio source configurations of a device. This command lists all audio source configurations in a device. The client need not know anything apriori about the audio source configurations in order to use the command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getAudioSourceConfigurations (callback) {
    return this.buildRequest('GetAudioSourceConfigurations', null, callback)
  }

  getAudioSourceConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCompatibleAudioSourceConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAudioSourceConfigurationOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setAudioSourceConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation lists all existing device audio encoder configurations. The client need not know anything apriori about the audio encoder configurations in order to use the command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getAudioEncoderConfigurations (callback) {
    return this.buildRequest('GetAudioEncoderConfigurations', null, callback)
  }

  getAudioEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCompatibleAudioEncoderConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAudioEncoderConfigurationOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setAudioEncoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation lists all video analytics configurations of a device. This command lists all configured video analytics in a device. The client need not know anything apriori about the video analytics in order to use the command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getVideoAnalyticsConfigurations (callback) {
    return this.buildRequest('GetVideoAnalyticsConfigurations', null, callback)
  }

  getVideoAnalyticsConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCompatibleVideoAnalyticsConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setVideoAnalyticsConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation lists all existing metadata configurations. The client need not know anything apriori about the metadata in order to use the command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getMetadataConfigurations (callback) {
    return this.buildRequest('GetMetadataConfigurations', null, callback)
  }

  getMetadataConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCompatibleMetadataConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getMetadataConfigurationOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setMetadataConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation lists all existing metadata configurations. The client need not know anything apriori about the metadata in order to use the command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getAudioOutputs (callback) {
    return this.buildRequest('GetAudioOutputs', null, callback)
  }

  /**
   * This command lists all existing AudioOutputConfigurations of a device. The NVC need not know anything apriori about the audio configurations to use this command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getAudioOutputConfigurations (callback) {
    return this.buildRequest('GetAudioOutputConfigurations', null, callback)
  }

  getAudioOutputConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCompatibleAudioOutputConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAudioOutputConfigurationOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setAudioOutputConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This command lists all existing AudioDecoderConfigurations of a device. The NVC need not know anything apriori about the audio decoder configurations in order to use this command.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getAudioDecoderConfigurations (callback) {
    return this.buildRequest('GetAudioDecoderConfigurations', null, callback)
  }

  getAudioDecoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getCompatibleAudioDecoderConfigurations () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getAudioDecoderConfigurationOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setAudioDecoderConfiguration () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  /**
   * This operation requests a URI that can be used to initiate a live media stream using RTSP as the control protocol. The returned URI shall remain valid indefinitely even if the profile is changed. The ValidUntilConnect, ValidUntilReboot and Timeout Parameter shall be set accordingly (ValidUntilConnect=false, ValidUntilReboot=false, timeout=PT0S).<br>
   * The correct syntax for the StreamSetup element for these media stream setups defined in 5.1.1 of the streaming specification are as follows:<br>
   * <ul>
   * <li>RTP unicast over UDP: StreamType = "RTP_unicast", TransportProtocol = "UDP"</li>
   * <li>RTP over RTSP over HTTP over TCP: StreamType = "RTP_unicast", TransportProtocol = "HTTP"</li>
   * <li>RTP over RTSP over TCP: StreamType = "RTP_unicast", TransportProtocol = "RTSP"</li>
   * </ul>
   * If a multicast stream is requested the VideoEncoderConfiguration, AudioEncoderConfiguration and MetadataConfiguration element inside the corresponding media profile must be configured with valid multicast settings.<br>
   * For full compatibility with other ONVIF services a device should not generate Uris longer than 128 octets.
   * @param {RTP-Unicast|RTP-Multicast} streamType Defines if a multicast or unicast stream is requested.
   * @param {UDP|HTTP|RTSP} protocolType The transport protocol to use.
   * @param {string} profileToken The ProfileToken element indicates the media profile to use and will define the configuration of the content of the stream.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getStreamUri (streamType, protocolType, profileToken, callback) {
    let promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if ((errMsg = Util.isInvalidValue(streamType, 'string'))) {
        reject(new Error('The "streamType" argument for getStreamUri is invalid: ' + errMsg))
        return
      }
      else if (!streamType.match(/^(RTP-Unicast|RTP-Multicast)$/)) {
        reject(new Error('The "streamType" argument for getStreamUri is invalid: The value must be either "UDP", "HTTP", or "RTSP".'))
        return
      }

      if ((errMsg = Util.isInvalidValue(protocolType, 'string'))) {
        reject(new Error('The "protocolType" argument for getStreamUri is invalid: ' + errMsg))
        return
      }
      else if (!protocolType.match(/^(UDP|HTTP|RTSP)$/)) {
        reject(new Error('The "protocolType" argument for getStreamUri is invalid: The value must be either "UDP", "HTTP", or "RTSP".'))
        return
      }

      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error('The "profileToken" argument for getStreamUri is invalid: ' + errMsg))
        return
      }

      let soapBody = ''
      soapBody += '<trt:StreamSetup>'
      soapBody += '<tt:Stream>' + streamType + '</tt:Stream>'
      soapBody += '<tt:Transport>'
      soapBody += '<tt:Protocol>' + protocolType + '</tt:Protocol>'
      soapBody += '</tt:Transport>'
      soapBody += '</trt:StreamSetup>'
      soapBody += '<trt:ProfileToken>' + profileToken + '</trt:ProfileToken>'

      this.buildRequest('GetStreamUri', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (callback) {
      promise.then(results => {
        callback(null, results)
      }).catch(error => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  /**
   * A client uses the GetSnapshotUri command to obtain a JPEG snapshot from the device. The returned URI shall remain valid indefinitely even if the profile is changed. The ValidUntilConnect, ValidUntilReboot and Timeout Parameter shall be set accordingly (ValidUntilConnect=false, ValidUntilReboot=false, timeout=PT0S). The URI can be used for acquiring a JPEG image through a HTTP GET operation. The image encoding will always be JPEG regardless of the encoding setting in the media profile. The Jpeg settings (like resolution or quality) may be taken from the profile if suitable. The provided image will be updated automatically and independent from calls to GetSnapshotUri.
   * @param {string} profileToken The ProfileToken element indicates the media profile to use and will define the source and dimensions of the snapshot.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getSnapshotUri (profileToken, callback) {
    let promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error('The "profileToken" argument for getStreamUri is invalid: ' + errMsg))
        return
      }

      let soapBody = ''
      soapBody += '<trt:ProfileToken>' + profileToken + '</trt:ProfileToken>'

      this.buildRequest('GetSnapshotUri', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (callback) {
      promise.then(results => {
        callback(null, results)
      }).catch(error => {
        callback(error)
      })
    }
    else {
      return promise
    }
  }

  startMulticastStreaming () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  stopMulticastStreaming () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setSynchronizationPoint () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getVideoSourceModes () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setVideoSourceMode () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  createOSD () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  deleteOSD () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getOSDs () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getOSD () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  setOSD () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }

  getOSDOptions () {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'))
    })
  }
}

module.exports = new Media()
