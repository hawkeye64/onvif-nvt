const Request = require('request')
const Util = require('./util')

/**
 * @class
 * Provide Snapshot functionaity for cameras.
 * <h3>Functions</h3>
 * {@link Snapshot#getSnapshot},
 * <br><br>
 * <h3>Overview</h3>
 * Use the Snapshot::getSnapshot() method to retrieve a snapshot from the ONVIF-compliant camera.
 */
class Snapshot {
  constructor () {
    this.snapshotUri = ''
    this.username = ''
    this.password = ''
  }

  init (snapshotUri, username, password) {
    this.snapshotUri = snapshotUri
    this.username = username
    this.password = password
  }

  /**
   * Retrieves a snapshot from the specified camera
   * @param {callback=} callback Optional callback, instead of a Promise.
   * @example
   * const OnvifManager = require('onvif-nvt')
   * OnvifManager.connect('10.10.1.60', 80, 'username', 'password')
   *   .then(results => {
   *     let camera = results
   *     // calling add method will automatically initialize snapshot
   *     // with the defaultProfile's snapshotUri
   *     camera.add('snapshot')
   *     camera.snapshot.getSnapshot()
   *       .then(results => {
   *         let mimeType = results.mimeType
   *         let rawImage = results.image
   *         let prefix = 'data:' + mimeType + ';base64,'
   *         let base64Image = Buffer.from(rawImage, 'binary').toString('base64')
   *         let image = prefix + base64Image
   *         // 'image' is now ready to be displayed on a web page
   *         // ...
   *       })
   *     }
   *   })
   */
  getSnapshot (callback) {
    let promise = new Promise((resolve, reject) => {
      Request({
        method: 'GET',
        uri: this.snapshotUri,
        gzip: true,
        encoding: 'binary',
        'auth': {
          'user': this.username,
          'pass': this.password,
          'sendImmediately': false
        }
      },
      (error, response, body) => {
        if (error) {
          reject(error)
        }
        const mimeType = response.headers['content-type']
        const data = {
          mimeType: mimeType,
          image: Buffer.from(body, 'binary')
        }
        resolve(data)
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

module.exports = new Snapshot()
