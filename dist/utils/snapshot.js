const Request = require('request');

const Util = require('./util');

class Snapshot {
  constructor() {
    this.snapshotUri = '';
    this.username = '';
    this.password = '';
  }

  init(snapshotUri, username, password) {
    this.snapshotUri = snapshotUri;
    this.username = username;
    this.password = password;
  }

  getSnapshot(callback) {
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
      }, (error, response, body) => {
        if (error) {
          reject(error);
          return;
        }

        if (response.statusCode === 200) {
          const mimeType = response.headers['content-type'];
          const data = {
            mimeType: mimeType,
            image: Buffer.from(body, 'binary')
          };
          resolve(data);
        } else {
          reject(response);
        }
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

module.exports = Snapshot;