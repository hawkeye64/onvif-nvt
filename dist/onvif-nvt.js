const Util = require('./utils/util');

class OnvifManager {
  constructor() {
    this.discovery = null;
    this.cameras = {};
  }

  add(name) {
    switch (name) {
      case 'discovery':
        let Discovery = require('./modules/discovery');

        this.discovery = new Discovery();
        break;

      default:
        throw new Error(`The only acceptable module that can be added to OnvifManager is "discovery" - not "${name}".`);
    }
  }

  connect(address, port, username, password, servicePath, callback) {
    let promise = new Promise((resolve, reject) => {
      let errMsg = '';

      if (errMsg = Util.isInvalidValue(address, 'string')) {
        reject(new Error(`The "address" argument for connect is invalid: ` + errMsg));
        return;
      }

      let c = this.cameras[address];

      if (c) {
        resolve(c);
        return;
      }

      port = port || 80;

      let Camera = require('./camera');

      let camera = new Camera();
      return camera.connect(address, port, username, password, servicePath).then(results => {
        this.cameras[address] = camera;
        resolve(camera);
      }).catch(error => {
        console.error(error);
        reject(error);
      });
    });

    if (Util.isValidCallback(callback)) {
      promise.then(results => {
        callback(null, results);
      }).catch(error => {
        callback(error);
      });
    } else {
      return promise;
    }
  }

}

module.exports = new OnvifManager();