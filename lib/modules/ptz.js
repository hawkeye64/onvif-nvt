const Soap = require('../utils/soap')
const Util = require('../utils/util')

/**
 * @class
 * <p>
 * {@link https://www.onvif.org/specs/srv/ptz/ONVIF-PTZ-Service-Spec-v1712.pdf}<br>
 * {@link https://www.onvif.org/ver20/ptz/wsdl/ptz.wsdl}<br>
 * </p>
 * <h3>Functions</h3>
 * {@link Ptz#getNodes},
 * {@link Ptz#getNode},
 * {@link Ptz#getConfigurations},
 * {@link Ptz#getConfiguration},
 * {@link Ptz#getConfigurationOptions},
 * {@link Ptz#setConfiguration},
 * {@link Ptz#getCompatibleConfigurations},
 * {@link Ptz#absoluteMove},
 * {@link Ptz#relativeMove},
 * {@link Ptz#continuousMove},
 * {@link Ptz#geoMove},
 * {@link Ptz#stop},
 * {@link Ptz#getStatus},
 * {@link Ptz#getStatus},
 * {@link Ptz#setPreset},
 * {@link Ptz#getPresets},
 * {@link Ptz#gotoPreset},
 * {@link Ptz#removePreset},
 * {@link Ptz#gotoHomePosition},
 * {@link Ptz#setHomePosition},
 * {@link Ptz#sendAuxiliaryCommand}
 * <br><br>
 * <h3>Overview</h3>
 * The PTZ model groups the possible movements of the PTZ unit into a Pan/Tilt component and
 * into a Zoom component. To steer the PTZ unit, the service provides absolute move, relative
 * move and continuous move operations. Different coordinate systems and units are used to feed
 * these operations.<br>
 * The PTZ service provides an AbsoluteMove operation to move the PTZ device to an absolute
 * position. The service expects the absolute position as an argument referencing an absolute
 * coordinate system. The speed of the Pan/Tilt movement and the Zoom movement can be
 * specified optionally. Speed values are positive scalars and do not contain any directional
 * information. It is not possible to specify speeds for Pan and Tilt separately without knowledge
 * about the current position. This approach to specifying a desired position generally produces a
 * non-smooth and non-intuitive action.<br>
 * A RelativeMove operation is introduced by the PTZ service in order to steer the dome relative to
 * the current position, but without the need to know the current position. The operation expects a
 * positional translation as an argument referencing a relative coordinate system. This
 * specification distinguishes between relative and absolute coordinate systems, since there are
 * cases where no absolute coordinate system exists for a well-defined relative coordinate system.
 * An optional speed argument can be added to the RelativeMove operation with the same
 * meaning as for the AbsoluteMove operation.<br>
 * Finally, the PTZ device can be moved continuously via the ContinuousMove command in a
 * certain direction with a certain speed. Thereby, a velocity vector represents both, the direction
 * and the speed information. The latter is expressed by the length of the vector.
 * The Pan/Tilt and Zoom coordinates can be uniquely specified by augmenting the coordinates
 * with appropriate space URIs. A space URI uniquely represents the underlying coordinate system.
 * Section 5.7 defines a standard set of coordinate systems. A PTZ Node shall implement these
 * coordinate systems if the corresponding type of movement is supported by the PTZ Node. In
 * many cases, the Pan/Tilt position is represented by pan and tilt angles in a spherical coordinate
 * system. A digital PTZ, operating on a fixed megapixel camera, may express the camera’s
 * viewing direction by a pixel position on a static projection plane. Therefore, different coordinate
 * systems are needed in this case in order to capture the physical or virtual movements of the
 * PTZ device. Optionally, the PTZ Node may define its own device specific coordinate systems to
 * enable clients to take advantage of the specific properties of this PTZ Node.
 * The PTZ Node description retrieved via the GetNode or GetNodes operation contains all
 * coordinate systems supported by a specific PTZ Node. Each coordinate system belongs to one
 * of the following groups:
 * <ul>
 * <li>AbsolutePanTiltPositionSpace</li>
 * <li>RelativePanTiltTranslationSpace</li>
 * <li>ContinuousPanTiltVelocitySpace</li>
 * <li>PanTiltSpeedSpace</li>
 * <li>AbsoluteZoomPositionSpace</li>
 * <li>RelativeZoomTranslationSpace</li>
 * <li>ContinuousZoomVelocitySpace</li>
 * <li>ZoomSpeedSpace</li>
 * </ul>
 * If the PTZ node does not support the coordinate systems of a certain group, the corresponding
 * move operation will not be available for this PTZ node. For instance, if the list does not contain
 * an AbsolutePanTiltPositionSpace, the AbsoluteMove operation shall fail when an absolute
 * Pan/Tilt position is specified. The corresponding command section describes those spaces that
 * are required for a specific move command.<br>
 * <br>
 */
class Ptz {
  constructor () {
    this.soap = new Soap()
    this.timeDiff = 0
    this.serviceAddress = null
    this.username = null
    this.password = null
    this.defaultProfileToken = null

    this.namespaceAttributes = [
      'xmlns:tptz="http://www.onvif.org/ver20/ptz/wsdl"'
    ]
  }

  /**
   * Call this function directly after instantiating a Ptz object.
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
   * Sets the default profile token. This comes from media#getProfiles method.<br>
   * By default, this module will get the first Profile and use it as the default profile.
   * You can change the default profile by setting this function.
   * Note: This functionality is only used where API calls require a <strong>ProfileToken</strong> and one is not provided.
   * @param {string} profileToken The profileToken to use when one is not passed to a method requiring one.
   */
  setDefaultProfileToken (profileToken) {
    this.defaultProfileToken = profileToken
  }

  /**
   * Private function for creating a SOAP request.
   * @param {string} body The body of the xml.
   */
  createRequest (body) {
    const soapEnvelope = this.soap.createRequest({
      body: body,
      xmlns: this.namespaceAttributes,
      diff: this.timeDiff,
      username: this.username,
      password: this.password
    })
    return soapEnvelope
  }

  buildRequest (methodName, xml, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error(`The "callback" argument for ${methodName} is invalid:` + errMsg))
          return
        }
      }
      if (typeof methodName === 'undefined' || methodName === null) {
        reject(new Error('The "methodName" argument for buildRequest is required.'))
        return
      }
      else {
        if ((errMsg = Util.isInvalidValue(methodName, 'string'))) {
          reject(new Error('The "methodName" argument for buildRequest is invalid:' + errMsg))
          return
        }
      }
      let soapBody = ''
      if (typeof xml === 'undefined' || xml === null || xml === '') {
        soapBody += `<tptz:${methodName}/>`
      }
      else {
        soapBody += `<tptz:${methodName}>`
        soapBody += xml
        soapBody += `</tptz:${methodName}>`
      }
      const soapEnvelope = this.createRequest(soapBody)
      this.soap.makeRequest('ptz', this.serviceAddress, methodName, soapEnvelope)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
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
   * Used internally. Creates xml where PanTilt (x|y) and Zoom (z) are needed.
   * @param {object} vectors One of PanTilt (x,y) or Zoom (z), or both, is required.
   * @param {object=} vectors.x The x component corresponds to pan.
   * @param {object=} vectors.y The y component corresponds to tilt.
   * @param {object=} vectors.z The z component corresponds to zoom.
   */
  panTiltZoomOptions (vectors) {
    let soapBody = ''
    if (typeof vectors !== 'undefined' && vectors !== null) {
      if ('x' in vectors && 'y' in vectors) {
        soapBody += '<tt:PanTilt x="' + vectors.x + '" y="' + vectors.y + '"/>'
      }
      if ('z' in vectors) {
        soapBody += '<tt:Zoom x="' + vectors.z + '"/>'
      }
    }
    return soapBody
  }

  // ---------------------------------------------
  // PTZ API
  // ---------------------------------------------

  /**
   * A PTZ-capable device shall implement this operation and return all PTZ nodes available on the device.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getNodes (callback) {
    return this.buildRequest('GetNodes', null, callback)
  }

  /**
   * A PTZ-capable device shall implement the GetNode operation and return the properties of the
   * requested PTZ node, if it exists. Otherwise, the device shall respond with an appropriate fault
   * message.
   * @param {*} nodeToken Reference to the requested PTZNode.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getNode (nodeToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for getNode is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(nodeToken, 'string'))) {
        reject(new Error('The "nodeToken" argument for getNode is invalid: ' + errMsg))
        return
      }

      let soapBody = ''
      soapBody += '<tptz:NodeToken>' + nodeToken + '</tptz:NodeToken>'

      this.buildRequest('GetNode', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
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
   * The PTZConfiguration contains a reference to the PTZ node in which it belongs. This reference
   * cannot be changed by a client.<br>
   * The following elements are part of the PTZ Configuration:
   * <ul>
   * <li>PTZNodeToken – A mandatory reference to the PTZ node that the PTZ Configuration
   * belongs to.</li>
   * <li>DefaultAbsolutePanTiltPositionSpace – If the PTZ node supports absolute Pan/Tilt
   * movements, it shall specify one Absolute Pan/Tilt Position Space as default.</li>
   * <li>DefaultRelativePanTiltTranslationSpace – If the PTZ node supports relative Pan/Tilt
   * movements, it shall specify one RelativePan/Tilt Translation Space as default.</li>
   * <li>DefaultContinuousPanTiltVelocitySpace – If the PTZ node supports continuous
   * Pan/Tilt movements, it shall specify one continuous Pan/Tilt velocity space as default.</li>
   * <li>DefaultPanTiltSpeedSpace – If the PTZ node supports absolute or relative
   * movements, it shall specify one Pan/Tilt speed space as default.</li>
   * <li>DefaultAbsoluteZoomPositionSpace – If the PTZ node supports absolute zoom
   * movements, it shall specify one absolute zoom position space as default.</li>
   * <li>DefaultRelativeZoomTranslationSpace – If the PTZ node supports relative zoom
   * movements, it shall specify one relative zoom translation space as default.</li>
   * <li>DefaultContinuousZoomVelocitySpace – If the PTZ node supports continuous zoom
   * movements, it shall specify one continuous zoom velocity space as default.</li>
   * <li>DefaultPTZSpeed – If the PTZ node supports absolute or relative PTZ movements, it
   * shall specify corresponding default Pan/Tilt and Zoom speeds.</li>
   * <li>DefaultPTZTimeout – If the PTZ node supports continuous movements, it shall
   * specify a default timeout, after which the movement stops.</li>
   * <li>PanTiltLimits – The Pan/Tilt limits element should be present for a PTZ node that
   * supports an absolute Pan/Tilt. If the element is present it signals the support for
   * configurable Pan/Tilt limits. If limits are enabled, the Pan/Tilt movements shall
   * always stay within the specified range. The Pan/Tilt limits are disabled by setting the
   * limits to –INF or +INF.</li>
   * <li>ZoomLimits – The zoom limits element should be present for a PTZ node that
   * supports absolute zoom. If the element is present it signals the supports for
   * configurable zoom limits. If limits are enabled the zoom movements shall always stay
   * within the specified range. The Zoom limits are disabled by settings the limits to –INF
   * and +INF.</li>
   * <li>MoveRamp – The optional acceleration ramp used by the device when moving.</li>
   * <li>PresetRamp – The optional acceleration ramp used by the device when recalling
   * presets.</li>
   * <li>PresetTourRamp – The optional acceleration ramp used by the device when
   * executing PresetTours.</li>
   * </ul>
   * The default position/translation/velocity spaces are introduced to allow clients sending move
   * requests without the need to specify a certain coordinate system. The default speeds are
   * introduced to control the speed of move requests (absolute, relative, preset), where no explicit
   * speed has been set.<br>
   * The allowed pan and tilt range for Pan/Tilt limits is defined by a two-dimensional space range
   * that is mapped to a specific absolute Pan/Tilt position space. At least one Pan/Tilt position
   * space is required by the PTZNode to support Pan/Tilt limits. The limits apply to all supported
   * absolute, relative and continuous Pan/Tilt movements. The limits shall be checked within the
   * coordinate system for which the limits have been specified. That means that even if movements
   * are specified in a different coordinate system, the requested movements shall be transformed to
   * the coordinate system of the limits where the limits can be checked. When a relative or
   * continuous movements is specified, which would leave the specified limits, the PTZ unit has to
   * move along the specified limits. The Zoom Limits have to be interpreted accordingly.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getConfigurations (callback) {
    return this.buildRequest('GetConfigurations', null, callback)
  }

  /**
   * A PTZ-capable device shall implement the GetConfigurationOptions operation. It returns the list
   * of supported coordinate systems including their range limitations. Therefore, the options MAY
   * differ depending on whether the PTZ configuration is assigned to a profile(see ONVIF Media
   * Service Specification) containing a VideoSourceConfiguration. In that case, the options may
   * additionally contain coordinate systems referring to the image coordinate system described by
   * the VideoSourceConfiguration. Each listed coordinate system belongs to one of the groups
   * listed in Section 4. If the PTZ node supports continuous movements, it shall return a timeout
   * range within which timeouts are accepted by the PTZ node.
   * @param {string} configurationToken Reference to the requested PTZ configuration.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getConfiguration (configurationToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for getConfiguration is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(configurationToken, 'string'))) {
        reject(new Error('The "configurationToken" argument for getConfiguration is invalid: ' + errMsg))
        return
      }

      let soapBody = ''
      soapBody += '<tptz:PTZConfigurationToken>' + configurationToken + '</tptz:PTZConfigurationToken>'

      this.buildRequest('GetConfiguration', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
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
   * A PTZ-capable device shall implement the GetConfigurationOptions operation. It returns the list
   * of supported coordinate systems including their range limitations. Therefore, the options MAY
   * differ depending on whether the PTZ configuration is assigned to a profile(see ONVIF Media
   * Service Specification) containing a VideoSourceConfiguration. In that case, the options may
   * additionally contain coordinate systems referring to the image coordinate system described by
   * the VideoSourceConfiguration. Each listed coordinate system belongs to one of the groups
   * listed in Section 4. If the PTZ node supports continuous movements, it shall return a timeout
   * range within which timeouts are accepted by the PTZ node.
   * @param {string} configurationToken Reference to the requested PTZ configuration.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getConfigurationOptions (configurationToken, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for getConfigurationOptions is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(configurationToken, 'string'))) {
        reject(new Error('The "configurationToken" argument for getConfigurationOptions is invalid: ' + errMsg))
        return
      }

      let soapBody = ''
      soapBody += '<tptz:ConfigurationToken>' + configurationToken + '</tptz:ConfigurationToken>'

      this.buildRequest('GetConfigurationOptions', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
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
   * <strong>+++ TODO: This function is incomplete and requires a LOT of work for little return.</strong><br>
   * <strong>+++ Alternatively, you can pass XML in for ptzConfigurationOptions in the desired</strong><br>
   * <strong>+++ way required by the spec, in which case the function will work.</strong><br>
   * A PTZ-capable device shall implement the SetConfiguration operation. The ForcePersistence
   * flag indicates if the changes remain after reboot of the device.
   * @param {string} configurationToken Reference to the PTZ configuration to be modified.
   * @param {xml} ptzConfigurationOptions The requested PTZ node configuration options.
   * @param {boolean} forcePersistence Deprecated modifier for temporary settings if supported by the device.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  setConfiguration (configurationToken, ptzConfigurationOptions, forcePersistence, callback) {
    const promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for setConfiguration is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(configurationToken, 'string'))) {
        reject(new Error('The "configurationToken" argument for setConfiguration is invalid: ' + errMsg))
        return
      }

      if ((errMsg = Util.isInvalidValue(ptzConfigurationOptions, 'object'))) {
        reject(new Error('The "ptzConfigurationOptions" argument for setConfiguration is invalid: ' + errMsg))
        return
      }

      let soapBody = ''
      soapBody += '<tptz:PTZConfigurationToken>' + configurationToken + '</tptz:PTZConfigurationToken>'
      soapBody += '<tptz:PTZConfigurationOptions>' + ptzConfigurationOptions + '</tptz:PTZConfigurationOptions>'

      this.buildRequest('SetConfiguration', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
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
   * A device signalling support for GetCompatibleConfigurations via the capability
   * GetCompatibleConfigurations shall return all available PTZConfigurations that can be added to
   * the referenced media profile through the GetComatibleConfigurations operation.<br>
   * A device providing more than one PTZConfiguration or more than one
   * VideoSourceConfiguration or which has any other resource interdependency between
   * PTZConfiguration entities and other resources listable in a media profile should implement this
   * operation. PTZConfiguration entities returned by this operation shall not fail on adding them to
   * the referenced media profile.
   * @param {string=} profileToken If no profileToken is provided, then the defaultProfileToken will be used.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getCompatibleConfigurations (profileToken, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken

      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for getCompatibleConfigurations is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error('The "profileToken" argument for getCompatibleConfigurations is invalid: ' + errMsg))
        return
      }

      let soapBody = ''
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>'

      this.buildRequest('GetCompatibleConfigurations', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
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
   * If a PTZ node supports absolute Pan/Tilt or absolute Zoom movements, it shall support the
   * AbsoluteMove operation. The position argument of this command specifies the absolute position
   * to which the PTZ unit moves. It splits into an optional Pan/Tilt element and an optional Zoom
   * element. If the Pan/Tilt position is omitted, the current Pan/Tilt movement shall NOT be affected
   * by this command. The same holds for the zoom position.<br>
   * The spaces referenced within the position shall be absolute position spaces supported by the
   * PTZ node. If the space information is omitted, the corresponding default spaces of the PTZ
   * configuration, a part of the specified Media Profile, is used. A device may support absolute
   * Pan/Tilt movements, absolute Zoom movements or no absolute movements by providing only
   * absolute position spaces for the supported cases.<br>
   * An existing Speed argument overrides the DefaultSpeed of the corresponding PTZ configuration
   * during movement to the requested position. If spaces are referenced within the Speed argument,
   * they shall be Speed Spaces supported by the PTZ Node.<br>
   * The operation shall fail if the requested absolute position is not reachable.
   * @param {string=} profileToken If no profileToken is provided, then the defaultProfileToken will be used.
   * @param {object} position Vector specifying the absolute target position.
   * @param {float=} position.x The x component corresponds to pan.
   * @param {float=} position.y The y component corresponds to tilt.
   * @param {float=} position.z A zoom position.
   * @param {object=} speed Speed vector specifying the velocity of pan, tilt and zoom.
   * @param {float=} speed.x The x component corresponds to pan.  If omitted in a request, the current (if any) PanTilt movement should not be affected.
   * @param {float=} speed.y The y component corresponds to tilt.  If omitted in a request, the current (if any) PanTilt movement should not be affected
   * @param {float=} speed.z A zoom speed. If omitted in a request, the current (if any) Zoom movement should not be affected.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  absoluteMove (profileToken, position, speed, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken

      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for absoluteMove is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error('The "profileToken" argument for absoluteMove is invalid: ' + errMsg))
        return
      }
      if ((errMsg = Util.isInvalidValue(position, 'object'))) {
        reject(new Error('The "position" argument for absoluteMove is invalid: ' + errMsg))
        return
      }
      if (typeof speed !== 'undefined' && speed !== null) {
        if ((errMsg = Util.isInvalidValue(speed, 'object'))) {
          reject(new Error('The "speed" argument for absoluteMove is invalid: ' + errMsg))
          return
        }
      }

      let soapBody = ''
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>'
      soapBody += '<tptz:Position>' + this.panTiltZoomOptions(position) + '</tptz:Position>'
      if (typeof speed !== 'undefined' && speed !== null) {
        soapBody += '<tptz:Speed>' + this.panTiltZoomOptions(speed) + '</tptz:Speed>'
      }

      this.buildRequest('AbsoluteMove', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
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
   * If a PTZ node supports relative Pan/Tilt or relative Zoom movements, then it shall support the
   * RelativeMove operation. The translation argument of this operation specifies the difference from
   * the current position to the position to which the PTZ device is instructed to move. The operation
   * is split into an optional Pan/Tilt element and an optional Zoom element. If the Pan/Tilt element is
   * omitted, the current Pan/Tilt movement shall NOT be affected by this command. The same holds
   * for the zoom element.<br>
   * The spaces referenced within the translation element shall be translation spaces supported by
   * the PTZ node. If the space information is omitted for the translation argument, the
   * corresponding default spaces of the PTZ configuration, which is part of the specified Media
   * Profile, is used. A device may support relative Pan/Tilt movements, relative Zoom movements or
   * no relative movements by providing only translation spaces for the supported cases.
   * An existing speed argument overrides the DefaultSpeed of the corresponding PTZ configuration
   * during movement by the requested translation. If spaces are referenced within the speed
   * argument, they shall be speed spaces supported by the PTZ node.<br>
   * The command can be used to stop the PTZ unit at its current position by sending zero values for
   * Pan/Tilt and Zoom. Stopping shall have the very same effect independent of the relative space
   * referenced.<br>
   * If the requested translation leads to an absolute position which cannot be reached, the PTZ
   * Node shall move to a reachable position along the border of valid positions.
   * @param {string=} profileToken If no profileToken is provided, then the defaultProfileToken will be used.
   * @param {object} translation Vector specifying the positional Translation relative to the current position.
   * @param {float=} translation.x The x component corresponds to pan.
   * @param {float=} translation.y The y component corresponds to tilt.
   * @param {float=} translation.z A zoom position.
   * @param {object=} speed Speed vector specifying the velocity of pan, tilt and zoom.
   * @param {float=} speed.x The x component corresponds to pan.  If omitted in a request, the current (if any) PanTilt movement should not be affected.
   * @param {float=} speed.y The y component corresponds to tilt.  If omitted in a request, the current (if any) PanTilt movement should not be affected
   * @param {float=} speed.z A zoom speed. If omitted in a request, the current (if any) Zoom movement should not be affected.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  relativeMove (profileToken, translation, speed, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken

      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for relativeMove is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error('The "profileToken" argument for relativeMove is invalid: ' + errMsg))
        return
      }
      if (typeof translation !== 'undefined' && translation !== null) {
        if ((errMsg = Util.isInvalidValue(translation, 'object'))) {
          reject(new Error('The "translation" argument for relativeMove is invalid: ' + errMsg))
          return
        }
      }
      if (typeof speed !== 'undefined' && speed !== null) {
        if ((errMsg = Util.isInvalidValue(speed, 'object'))) {
          reject(new Error('The "speed" argument for relativeMove is invalid: ' + errMsg))
          return
        }
      }

      let soapBody = ''
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>'
      if (typeof translation !== 'undefined' && translation !== null) {
        soapBody += '<tptz:Translation>' + this.panTiltZoomOptions(translation) + '</tptz:Translation>'
      }
      if (typeof speed !== 'undefined' && speed !== null) {
        soapBody += '<tptz:Speed>' + this.panTiltZoomOptions(speed) + '</tptz:Speed>'
      }

      this.buildRequest('RelativeMove', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
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
   * A PTZ-capable device shall support continuous movements. The velocity argument of this
   * command specifies a signed speed value for the Pan, Tilt and Zoom. The combined Pan/Tilt
   * element is optional and the Zoom element itself is optional. If the Pan/Tilt element is omitted,
   * the current Pan/Tilt movement shall NOT be affected by this command. The same holds for the
   * Zoom element. The spaces referenced within the velocity element shall be velocity spaces
   * supported by the PTZ Node. If the space information is omitted for the velocity argument, the
   * corresponding default spaces of the PTZ configuration belonging to the specified Media Profile
   * is used. A device MAY support continuous Pan/Tilt movements and/or continuous Zoom
   * movements by providing only velocity spaces for the supported cases.<br>
   * An existing timeout argument overrides the DefaultPTZTimeout parameter of the corresponding
   * PTZ configuration for this Move operation. The timeout parameter specifies how long the PTZ
   * node continues to move.<br>
   * A device shall stop movement in a particular axis (Pan, Tilt, or Zoom) when zero is sent as the
   * ContinuousMove parameter for that axis. Stopping shall have the same effect independent of
   * the velocity space referenced. This command has the same effect on a continuous move as the
   * stop command specified in section 5.3.5.<br>
   * If the requested velocity leads to absolute positions which cannot be reached, the PTZ node
   * shall move to a reachable position along the border of its range. A typical application of the
   * continuous move operation is controlling PTZ via joystick.
   * @param {string=} profileToken If no profileToken is provided, then the defaultProfileToken will be used.
   * @param {object} velocity One of PanTilt (x,y) or Zoom (z), or both, is required.
   * @param {float=} velocity.x Pan speed.
   * @param {float=} velocity.y Tilt spped.
   * @param {float=} velocity.z Zoom speed.
   * @param {integer=} timeout Duration: An optional Timeout parameter.
   * @param {callback=} callback Optional callback, instead of a Promise.
   * @example
   * const OnvifManager = require('onvif-nvt')
   * OnvifManager.connect('10.10.1.60', 80, 'username', 'password')
   *   .then(results => {
   *     let camera = results
   *     if (camera.ptz) { // PTZ is supported on this device
   *       let velocity = { x: 1, y: 0 }
   *       camera.ptz.continuousMove(null, velocity)
   *         .then(() => {
   *           setTimeout(() => {
   *             camera.ptz.stop()
   *           }, 5000) // stop the camera after 5 seconds
   *         })
   *     }
   *   })
   */
  continuousMove (profileToken, velocity, timeout, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken

      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for continuousMove is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error('The "profileToken" argument for continuousMove is invalid: ' + errMsg))
        return
      }
      if (velocity) {
        if ((errMsg = Util.isInvalidValue(velocity, 'object'))) {
          reject(new Error('The "velocity" argument for continuousMove is invalid: ' + errMsg))
          return
        }
      }
      if (typeof timeout !== 'undefined' && timeout !== null) {
        if ((errMsg = Util.isInvalidValue(timeout, 'integer'))) {
          reject(new Error('The "timeout" property for continuousMove is invalid: ' + errMsg))
          return
        }
      }

      let soapBody = ''
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>'
      if (velocity) {
        soapBody += '<tptz:Velocity>' + this.panTiltZoomOptions(velocity) + '</tptz:Velocity>'
      }
      if (timeout) {
        soapBody += '<tptz:Timeout>PT' + timeout + 'S</tptz:Timeout>'
      }

      this.buildRequest('ContinuousMove', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
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
   * <strong>+++ This function is untested as I do not have any cameras that support this feature.</strong><br>
   * A device signaling GeoMove in one of its PTZ nodes shall support this command.
   * The optional AreaHeight and AreaWidth parameters can be added to the request, so that the
   * PTZ-capable device can internally determine the zoom factor. In case both AreaHeight and
   * AreaWidth are not provided, the unit will not change the zoom. AreaHeight and AreaWidth are
   * expressed in meters.<br>
   * An existing speed argument overrides the DefaultSpeed of the corresponding PTZ configuration
   * during movement by the requested translation. If spaces are referenced within the speed
   * argument, they shall be speed spaces supported by the PTZ node.<br>
   * If the PTZ-capable device does not support automatic retrieval of the geolocation, it shall be
   * configured by using SetGeoLocation before it can perform geo-referenced commands. In case
   * the client requests a GeoMove command before the geolocation of the device is configured,
   * the device shall return an error.<br>
   * Depending on the kinematics of the PTZ-capable device, the requested position may not be
   * reachable. In this situation the device shall return an error, signalling that it cannot perform the
   * requested action due to physical limitations.
   * @param {string=} profileToken If no profileToken is provided, then the defaultProfileToken will be used.
   * @param {object} geoLocation Target coordinates.
   * @param {float} geoLocation.lon East west location as angle.
   * @param {float} geoLocation.lat North south location as angle.
   * @param {float} geoLocation.elevation Height in meters above sea level.
   * @param {object=} speed Speed vector specifying the velocity of pan, tilt and zoom.
   * @param {float=} speed.x The x component corresponds to pan.  If omitted in a request, the current (if any) PanTilt movement should not be affected.
   * @param {float=} speed.y The y component corresponds to tilt.  If omitted in a request, the current (if any) PanTilt movement should not be affected
   * @param {float=} speed.z A zoom speed. If omitted in a request, the current (if any) Zoom movement should not be affected.
   * @param {float=} areaWidth Optional area to be shown.
   * @param {float=} areaHeight Optional area to be shown.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  geoMove (profileToken, geoLocation, speed, areaWidth, areaHeight, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken

      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for geoMove is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error('The "profileToken" argument for geoMove is invalid: ' + errMsg))
        return
      }
      if ((errMsg = Util.isInvalidValue(geoLocation, 'object'))) {
        reject(new Error('The "position" argument for geoMove is invalid: ' + errMsg))
        return
      }
      if (!('lat' in geoLocation)) {
        reject(new Error('The "geoLocation.lat" is a required argument for geoMove: ' + errMsg))
        return
      }
      if ((errMsg = Util.isInvalidValue(geoLocation.lat, 'float'))) {
        reject(new Error('The "geoLocation.lat" argument for geoMove is invalid: ' + errMsg))
        return
      }
      if (!('lon' in geoLocation)) {
        reject(new Error('The "geoLocation.lon" is a required argument for geoMove: ' + errMsg))
        return
      }
      if ((errMsg = Util.isInvalidValue(geoLocation.lon, 'float'))) {
        reject(new Error('The "geoLocation.lon" argument for geoMove is invalid: ' + errMsg))
        return
      }
      if (!('elevation' in geoLocation)) {
        reject(new Error('The "geoLocation.elevation" is a required argument for geoMove: ' + errMsg))
        return
      }
      if ((errMsg = Util.isInvalidValue(geoLocation.elevation, 'float'))) {
        reject(new Error('The "geoLocation.elevation" argument for geoMove is invalid: ' + errMsg))
        return
      }
      if (typeof speed !== 'undefined' && speed !== null) {
        if ((errMsg = Util.isInvalidValue(speed, 'object'))) {
          reject(new Error('The "speed" argument for geoMove is invalid: ' + errMsg))
          return
        }
      }
      if (typeof areaWidth !== 'undefined' && areaWidth !== null) {
        if ((errMsg = Util.isInvalidValue(areaWidth, 'float'))) {
          reject(new Error('The "areaWidth" argument for geoMove is invalid: ' + errMsg))
          return
        }
      }
      if (typeof areaHeight !== 'undefined' && areaHeight !== null) {
        if ((errMsg = Util.isInvalidValue(areaHeight, 'float'))) {
          reject(new Error('The "areaHeight" argument for geoMove is invalid: ' + errMsg))
          return
        }
      }

      let soapBody = ''
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>'
      soapBody += '<tptz:Target lat="' + geoLocation.lat + '" lon="' + geoLocation.lon + '" elevation="' + geoLocation.elevation + '" />'
      if (typeof speed !== 'undefined' && speed !== null) {
        soapBody += '<tptz:Speed>' + this.panTiltZoomOptions(speed) + '</tptz:Speed>'
      }
      if (typeof areaWidth !== 'undefined' && areaWidth !== null) {
        soapBody += '<tptz:AreaWidth>' + areaWidth + '</tptz:AreaWidth>'
      }
      if (typeof areaHeight !== 'undefined' && areaHeight !== null) {
        soapBody += '<tptz:AreaHeight>' + areaWidth + '</tptz:AreaHeight>'
      }

      this.buildRequest('GeoMove', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
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
   * A PTZ-capable device shall support the stop operation. If no stop filter arguments are present,
   * this command stops all ongoing pan, tilt and zoom movements. The stop operation can be
   * filtered to stop a specific movement by setting the corresponding stop argument.
   * @param {string=} profileToken If no profileToken is provided, then the defaultProfileToken will be used.
   * @param {boolean=} panTilt Defaults to true..........
   * @param {boolean=} zoom Defaults to true
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  stop (profileToken, panTilt, zoom, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken

      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for stop is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error('The "profileToken" argument for stop is invalid: ' + errMsg))
        return
      }
      if (typeof panTilt !== 'undefined' && panTilt !== null) {
        if ((errMsg = Util.isInvalidValue(panTilt, 'boolean'))) {
          reject(new Error('The "panTilt" property for stop is invalid: ' + errMsg))
          return
        }
      }
      if (typeof zoom !== 'undefined' && zoom !== null) {
        if ((errMsg = Util.isInvalidValue(zoom, 'boolean'))) {
          reject(new Error('The "zoom" property for stop is invalid: ' + errMsg))
          return
        }
      }

      let soapBody = ''
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>'
      if (typeof panTilt !== 'undefined' && panTilt !== null) {
        // soapBody += '<tptz:PanTilt>' + (panTilt ? 1 : 0) + '</tptz:PanTilt>'
        soapBody += '<tptz:PanTilt>' + panTilt + '</tptz:PanTilt>'
      }
      if (typeof zoom !== 'undefined' && zoom !== null) {
        // soapBody += '<tptz:Zoom>' + (zoom ? 1 : 0) + '</tptz:Zoom>'
        soapBody += '<tptz:Zoom>' + zoom + '</tptz:Zoom>'
      }

      this.buildRequest('Stop', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
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
   * A PTZ-capable device shall be able to report its PTZ status through the GetStatus command.
   * The PTZ status contains the following information:
   * <ul>
   * <li>Position (optional) – Specifies the absolute position of the PTZ unit together with the
   * space references. The default absolute spaces of the corresponding PTZ configuration
   * shall be referenced within the position element. This information shall be present if the
   * device signals support via the capability StatusPosition.</li>
   * <li>MoveStatus (optional) – Indicates if the Pan/Tilt/Zoom device unit is currently moving, idle
   * or in an unknown state. This information shall be present if the device signals support
   * via the capability MoveStatus. The state Unknown shall not be used during normal
   * operation, but is reserved to initialization or error conditions.</li>
   * <li>Error (optional) – States a current PTZ error condition. This field shall be present if the
   * MoveStatus signals Unknown.</li>
   * <li>UTC Time – Specifies the UTC time when this status was generated.</li>
   * </ul>.
   * @param {string=} profileToken If no profileToken is provided, then the defaultProfileToken will be used.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getStatus (profileToken, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken

      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for getStatus is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error('The "profileToken" argument for relativeMove is invalid: ' + errMsg))
        return
      }

      let soapBody = ''
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>'

      this.buildRequest('GetStatus', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
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
   * The SetPreset command saves the current device position parameters so that the device can
   * move to the saved preset position through the GotoPreset operation.<br>
   * If the PresetToken parameter is absent, the device shall create a new preset. Otherwise it shall
   * update the stored position and optionally the name of the given preset. If creation is successful,
   * the response contains the PresetToken which uniquely identifies the preset. An existing preset
   * can be overwritten by specifying the PresetToken of the corresponding preset. In both cases
   * (overwriting or creation) an optional PresetName can be specified. The operation fails if the PTZ
   * device is moving during the SetPreset operation.<br>
   * The device MAY internally save additional states such as imaging properties in the PTZ preset
   * which then should be recalled in the GotoPreset operation. A device shall accept a valid
   * SetPresetRequest that does not include the optional element PresetName.
   * Devices may require unique preset names and reject a request that contains an already existing
   * PresetName by responding with the error message ter:PresetExist.
   * @param {string=} profileToken If no profileToken is provided, then the defaultProfileToken will be used.
   * @param {string=} presetToken Optional existing preset token to update a preset position.
   * @param {string=} presetName Optional name to be assigned to the preset position.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  setPreset (profileToken, presetToken, presetName, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken

      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for setPreset is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error('The "profileToken" argument for setPreset is invalid: ' + errMsg))
        return
      }
      if (typeof presetToken !== 'undefined' && presetToken !== null) {
        if ((errMsg = Util.isInvalidValue(presetToken, 'string'))) {
          reject(new Error('The "presetToken" argument for setPreset is invalid: ' + errMsg))
          return
        }
      }
      if (typeof presetName !== 'undefined' && presetName !== null) {
        if ((errMsg = Util.isInvalidValue(presetName, 'string'))) {
          reject(new Error('The "presetName" argument for setPreset is invalid: ' + errMsg))
          return
        }
      }
      if (!presetToken && !presetName) {
        reject(new Error('Either the "profileToken" or the "presetName" argument must be specified in method "setPreset".'))
        return
      }

      let soapBody = ''
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>'
      if (presetToken) {
        soapBody += '<tptz:PresetToken>' + presetToken + '</tptz:PresetToken>'
      }
      if (presetName) {
        soapBody += '<tptz:PresetName>' + presetName + '</tptz:PresetName>'
      }

      this.buildRequest('SetPreset', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
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
   * The GetPresets operation returns the saved presets consisting of the following elements:
   * <ul>
   * <li>Token – A unique identifier to reference the preset.</li>
   * <li>Name – An optional mnemonic name.</li>
   * <li>PTZ Position – An optional absolute position. If the PTZ node supports absolute
   * Pan/Tilt position spaces, the Pan/Tilt position shall be specified. If the PTZ node
   * supports absolute zoom position spaces, the zoom position shall be specified.</li>
   * </ul>.
   * @param {string=} profileToken If no profileToken is provided, then the defaultProfileToken will be used.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  getPresets (profileToken, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken

      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for getPresets is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error('The "profileToken" argument for getPresets is invalid: ' + errMsg))
        return
      }

      let soapBody = ''
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>'

      this.buildRequest('GetPresets', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
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
   * The GotoPreset operation recalls a previously set preset. If the speed parameter is omitted, the
   * default speed of the corresponding PTZ configuration shall be used. The speed parameter can
   * only be specified when speed spaces are available for the PTZ node. The GotoPreset command
   * is a non-blocking operation and can be interrupted by other move commands.
   * @param {string=} profileToken If no profileToken is provided, then the defaultProfileToken will be used.
   * @param {string} presetToken Reference to an existing preset token.
   * @param {object=} speed Speed vector specifying the velocity of pan, tilt and zoom.
   * @param {float=} speed.x The x component corresponds to pan.  If omitted in a request, the current (if any) PanTilt movement should not be affected.
   * @param {float=} speed.y The y component corresponds to tilt.  If omitted in a request, the current (if any) PanTilt movement should not be affected
   * @param {float=} speed.z A zoom speed. If omitted in a request, the current (if any) Zoom movement should not be affected.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  gotoPreset (profileToken, presetToken, speed, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken

      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for gotoPreset is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error('The "profileToken" argument for gotoPreset is invalid: ' + errMsg))
        return
      }
      if ((errMsg = Util.isInvalidValue(presetToken, 'string'))) {
        reject(new Error('The "presetToken" argument for gotoPreset is invalid: ' + errMsg))
        return
      }
      if (typeof speed !== 'undefined' && speed !== null) {
        if ((errMsg = Util.isInvalidValue(speed, 'object'))) {
          reject(new Error('The "speed" argument for gotoPreset is invalid: ' + errMsg))
          return
        }
      }

      let soapBody = ''
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>'
      soapBody += '<tptz:PresetToken>' + presetToken + '</tptz:PresetToken>'
      if (typeof speed !== 'undefined' && speed !== null) {
        soapBody += '<tptz:Speed>' + this.panTiltZoomOptions(speed) + '</tptz:Speed>'
      }

      this.buildRequest('GotoPreset', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
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
   * The RemovePreset operation removes a previously set preset.
   * @param {string=} profileToken If no profileToken is provided, then the defaultProfileToken will be used.
   * @param {string} presetToken Existing preset token to be removed.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  removePreset (profileToken, presetToken, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken

      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for removePreset is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error('The "profileToken" argument for removePreset is invalid: ' + errMsg))
        return
      }
      if ((errMsg = Util.isInvalidValue(presetToken, 'string'))) {
        reject(new Error('The "presetToken" argument for removePreset is invalid: ' + errMsg))
        return
      }

      let soapBody = ''
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>'
      soapBody += '<tptz:PresetToken>' + presetToken + '</tptz:PresetToken>'

      this.buildRequest('RemovePreset', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
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
   * This operation moves the PTZ unit to its home position. If the speed parameter is omitted, the
   * default speed of the corresponding PTZ configuration shall be used. The speed parameter can
   * only be specified when speed spaces are available for the PTZ node.The command is nonblocking
   * and can be interrupted by other move commands.
   * @param {string=} profileToken If no profileToken is provided, then the defaultProfileToken will be used.
   * @param {object=} speed Speed vector specifying the velocity of pan, tilt and zoom.
   * @param {float=} speed.x The x component corresponds to pan.  If omitted in a request, the current (if any) PanTilt movement should not be affected.
   * @param {float=} speed.y The y component corresponds to tilt.  If omitted in a request, the current (if any) PanTilt movement should not be affected
   * @param {float=} speed.z A zoom speed. If omitted in a request, the current (if any) Zoom movement should not be affected.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  gotoHomePosition (profileToken, speed, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken

      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for gotoHomePosition is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error('The "profileToken" argument for gotoHomePosition is invalid: ' + errMsg))
        return
      }
      if (typeof speed !== 'undefined' && speed !== null) {
        if ((errMsg = Util.isInvalidValue(speed, 'object'))) {
          reject(new Error('The "speed" argument for gotoHomePosition is invalid: ' + errMsg))
          return
        }
      }

      let soapBody = ''
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>'
      if (typeof speed !== 'undefined' && speed !== null) {
        soapBody += '<tptz:Speed>' + this.panTiltZoomOptions(speed) + '</tptz:Speed>'
      }

      this.buildRequest('GotoHomePosition', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
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
   * The SetHome operation saves the current position parameters as the home position, so that the
   * GotoHome operation can request that the device move to the home position.<br>
   * The SetHomePosition command shall return with a failure if the “home” position is fixed and
   * cannot be overwritten. If the SetHomePosition is successful, it shall be possible to recall the
   * home position with the GotoHomePosition command.
   * @param {string=} profileToken If no profileToken is provided, then the defaultProfileToken will be used.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  setHomePosition (profileToken, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken

      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for setHomePosition is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error('The "profileToken" argument for setHomePosition is invalid: ' + errMsg))
        return
      }

      let soapBody = ''
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>'

      this.buildRequest('SetHomePosition', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
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
   * This operation is used to call an auxiliary operation on the device. The supported commands
   * can be retrieved via the PTZ node properties. The AuxiliaryCommand should match the
   * supported command listed in the PTZ node; no other syntax is supported. If the PTZ node lists
   * the tt:IRLamp command, then the parameter of AuxiliaryCommand command shall conform to
   * the syntax specified in Section 8.6 Auxiliary operation of ONVIF Core Specification. The
   * SendAuxiliaryCommand shall be implemented when the PTZ node supports auxiliary commands.
   * @param {string=} profileToken If no profileToken is provided, then the defaultProfileToken will be used.
   * @param {string} auxiliaryData Auxiliary command to be applied.
   * @param {callback=} callback Optional callback, instead of a Promise.
   */
  sendAuxiliaryCommand (profileToken, auxiliaryData, callback) {
    const promise = new Promise((resolve, reject) => {
      profileToken = profileToken || this.defaultProfileToken

      let errMsg = ''
      if (typeof callback !== 'undefined' && callback !== null) {
        if ((errMsg = Util.isInvalidValue(callback, 'function'))) {
          reject(new Error('The "callback" argument for sendAuxiliaryCommand is invalid:' + errMsg))
          return
        }
      }
      if ((errMsg = Util.isInvalidValue(profileToken, 'string'))) {
        reject(new Error('The "profileToken" argument for sendAuxiliaryCommand is invalid: ' + errMsg))
        return
      }
      if ((errMsg = Util.isInvalidValue(auxiliaryData, 'string'))) {
        reject(new Error('The "auxiliaryData" argument for sendAuxiliaryCommand is invalid: ' + errMsg))
        return
      }

      let soapBody = ''
      soapBody += '<tptz:ProfileToken>' + profileToken + '</tptz:ProfileToken>'
      soapBody += '<tptz:AuxiliaryData>' + auxiliaryData + '<tptz:AuxiliaryData>'

      this.buildRequest('SendAuxiliaryCommand', soapBody)
        .then(results => {
          resolve(results)
        }).catch(error => {
          reject(error)
        })
    })
    if (Util.isValidCallback(callback)) {
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
}

module.exports = Ptz
