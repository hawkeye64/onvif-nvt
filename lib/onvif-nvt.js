
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
        this.discovery = require('./modules/discovery')
        break
      default:
        throw new Error(`Cannot add '${name}' to OnvifManager`)
    }
  }

  /**
   * Connects to an ONVIF device.
   * @param {string} address The address of the ONVIF device (ie: 10.10.1.20)
   * @param {integer=} port The port of the ONVIF device. Defaults to 80.
   * @param {string=} username The user name used to make a connection.
   * @param {string=} password The password used to make a connection.
   * @param {callback=} callback Optional callback, instead of a Promise.
   * @returns A Promise. On success, resolve contains a Camera object.
   */
  connect (address, port, username, password, callback) {
    let promise = new Promise((resolve, reject) => {
      if (typeof address !== 'string' || address.length <= 0) {
        reject(new Error('address is required to connect to a Device'))
        return
      }
      port = port || 80

      let camera = require('./camera')
      this.cameras[address] = camera

      return camera.connect(address, port, username, password)
        .then(results => {
          // console.log(results)
          resolve(camera)
        })
        .catch(error => {
          console.error(error)
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
}

module.exports = new OnvifManager()
