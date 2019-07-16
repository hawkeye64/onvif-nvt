'use strict';

const Fs = require('fs');

const Path = require('path');

const pd = require('pretty-data').pd;

let writable = false;
let path = Path.resolve(__dirname, '../../test/data/xml');

function saveXml(service, methodName, xml) {
  if (writable) {
    const prettyXml = pd.xml(xml);
    const folderPath = path + `/${service}`;

    if (!Fs.existsSync(folderPath)) {
      Fs.mkdirSync(folderPath);
    }

    const filePath = folderPath + `/${methodName}.xml`;
    Fs.writeFileSync(filePath, prettyXml);
  }
}

function setPath(folder) {
  path = folder;

  if (!Fs.existsSync(path)) {
    Fs.mkdirSync(path);
  }
}

function setWritable(value) {
  writable = value;
}

const functions = {
  setWritable,
  setPath,
  saveXml
};
module.exports = functions;