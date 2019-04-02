const Soap = require('../utils/soap');

class Security {
  constructor() {
    this.soap = new Soap();
    this.timeDiff = 0;
    this.serviceAddress = null;
    this.username = null;
    this.password = null;
    this.namespaceAttributes = ['xmlns:tas="http://www.onvif.org/ver10/advancedsecurity/wsdl"'];
  }

  init(timeDiff, serviceAddress, username, password) {
    this.timeDiff = timeDiff;
    this.serviceAddress = serviceAddress;
    this.username = username;
    this.password = password;
  }

  createRequest(body) {
    let soapEnvelope = this.soap.createRequest({
      'body': body,
      'xmlns': this.namespaceAttributes,
      'diff': this.timeDiff,
      'username': this.username,
      'password': this.password
    });
    return soapEnvelope;
  }

  uploadPassphrase() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAllPassphrases() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deletePassphrase() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  createRSAKeyPair() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  uploadKeyPairInPKCS8() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getKeyStatus() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getPrivateKeyStatus() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAllKeys() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteKey() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  createPKCS10CSR() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  createSelfSignedCertificate() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  uploadCertificate() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  uploadCertificateWithPrivateKeyInPKCS12() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getCertificate() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAllCertificates() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteCertificate() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  createCertificationPath() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getCertificationPath() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAllCertificationPaths() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteCertificationPath() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  uploadCRL() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getCRL() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAllCRLs() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteCRL() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  createCertPathValidationPolicy() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getCertPathValidationPolicy() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAllCertPathValidationPolicies() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteCertPathValidationPolicy() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  addServerCertificateAssignment() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  removeServerCertificateAssignment() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  replaceServerCertificateAssignment() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAssignedServerCertificates() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setClientAuthenticationRequired() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getClientAuthenticationRequired() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  addCertPathValidationPolicyAssignment() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  removeCertPathValidationPolicyAssignment() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  replaceCertPathValidationPolicyAssignment() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAssignedCertPathValidationPolicies() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  addDot1XConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getAllDot1XConfigurations() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getDot1XConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteDot1XConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  setNetworkInterfaceDot1XConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getNetworkInterfaceDot1XConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  deleteNetworkInterfaceDot1XConfiguration() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

  getServiceCapabilities() {
    return new Promise((resolve, reject) => {
      reject(new Error('Not implemented'));
    });
  }

}

module.exports = Security;