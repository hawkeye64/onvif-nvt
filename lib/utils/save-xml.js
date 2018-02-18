'use strict'

const Fs = require('fs')
const Path = require('path')
const pd = require('pretty-data').pd
let writable = false
let path = Path.resolve(__dirname, '../../test/data/xml')

function saveXml (name, xml) {
  if (writable) {
    let prettyXml = pd.xml(xml)
    let filePath = path + `/${name}.xml`
    Fs.writeFileSync(filePath, prettyXml)
  }
}

function setPath (folder) {
  path = folder
  // make sure it exists
  if (!Fs.existsSync(path)) {
    Fs.mkdirSync(path)
  }
}

function setWritable (value) {
  writable = value
}

const functions = {
  setWritable,
  setPath,
  saveXml
}

module.exports = functions
