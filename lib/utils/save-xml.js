'use strict'

const Fs = require('fs')
const Path = require('path')
const pd = require('pretty-data').pd
let writable = false

function saveXml (name, xml) {
  if (writable) {
    let prettyXml = pd.xml(xml)
    let filePath = Path.resolve(__dirname, `../../test/data/xml/${name}.xml`)
    Fs.writeFileSync(filePath, prettyXml)
  }
}

function setWritable (value) {
  writable = value
}

const functions = {
  setWritable,
  saveXml
}

module.exports = functions
