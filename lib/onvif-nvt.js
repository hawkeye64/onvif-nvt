const Util = require('./utils/util')

/**
 * If the OnvifManager class is used to connect to a camera, it will
 * manage your devices (cameras). It stores cameras by address. You
 * can use address to retrieve the camera.
 */
class OnvifManager {
  constructor () {
    this.discovery = null
    this.cameras = {}
  }

  /**
   * Add a module to OnvifManager. Currently, the only available module is 'discovery'.
   * @param {string} name The name of the module.
   */
  add (name) {
    switch (name) {
      case 'discovery':
        let Discovery = require('./modules/discovery')
        this.discovery = new Discovery()
        break
      default:
        throw new Error(`The only acceptable module that can be added to OnvifManager is "discovery" - not "${name}".`)
    }
  }

  /**
   * Connects to an ONVIF device.
   * @param {string} address The address of the ONVIF device (ie: 10.10.1.20)
   * @param {integer=} port The port of the ONVIF device. Defaults to 80.
   * @param {string=} username The user name used to make a connection.
   * @param {string=} password The password used to make a connection.
   * @param {string=} servicePath The service path for the camera. If null or 'undefined' the default path according to the ONVIF spec will be used.
   * @param {callback=} callback Optional callback, instead of a Promise.
   * @returns A Promise. On success, resolve contains a Camera object.
   */
  connect (address, port, username, password, servicePath, callback) {
    let promise = new Promise((resolve, reject) => {
      let errMsg = ''
      if ((errMsg = Util.isInvalidValue(address, 'string'))) {
        reject(new Error(`The "address" argument for connect is invalid: ` + errMsg))
        return
      }

      let c = this.cameras[address]
      if (c) {
        resolve(c)
        return
      }

      // default to port 80 if none provided
      port = port || 80

      let Camera = require('./camera')
      let camera = new Camera()
      this.cameras[address] = camera

      return camera.connect(address, port, username, password, servicePath)
        .then(results => {
          // console.log(results)
          resolve(camera)
        })
        .catch(error => {
          console.error(error)
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

module.exports = new OnvifManager()
