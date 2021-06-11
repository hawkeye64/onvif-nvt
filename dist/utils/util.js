'use strict';

const Crypto = require('crypto');

const Xml2js = require('xml2js');

function createUuidV4() {
  const clist = Crypto.randomBytes(16).toString('hex').toLowerCase().split('');
  clist[12] = '4';
  clist[16] = (parseInt(clist[16], 16) & 3 | 8).toString(16);
  const m = clist.join('').match(/^(.{8})(.{4})(.{4})(.{4})(.{12})/);
  const uuid = [m[1], m[2], m[3], m[4], m[5]].join('-');
  return uuid;
}

function getTypeOfValue(value) {
  if (value === undefined) {
    return 'undefined';
  } else if (value === null) {
    return 'null';
  } else if (Array.isArray(value)) {
    return 'array';
  }

  const t = typeof value;

  if (t === 'boolean') {
    return 'boolean';
  } else if (t === 'string') {
    return 'string';
  } else if (t === 'number') {
    if (value % 1 === 0) {
      return 'integer';
    } else {
      return 'float';
    }
  } else if (t === 'object') {
    if (Object.prototype.toString.call(value) === '[object Object]') {
      return 'object';
    } else {
      return 'unknown';
    }
  } else if (t === 'function') {
    return 'function';
  } else {
    return 'unknown';
  }
}

function isValidCallback(callback) {
  return !!(callback && typeof callback === 'function');
}

function execCallback(callback, arg1, arg2) {
  if (isValidCallback(callback)) {
    callback(arg1, arg2);
  }
}

function isXml(xml) {
  if (!xml) {
    return false;
  }

  const opts = {
    explicitRoot: false,
    explicitArray: false,
    ignoreAttrs: false,
    tagNameProcessors: [function (name) {
      const m = name.match(/^([^\:]+)\:([^\:]+)$/);
      return m ? m[2] : name;
    }]
  };
  let retVal = false;
  Xml2js.parseString(xml, opts, (error, results) => {
    if (error) {
      console.log(`isXml: ${xml} is not xml`, error);
      retVal = false;
    } else {
      retVal = true;
    }
  });
  return retVal;
}

function isInvalidValue(value, type, allowEmpty) {
  const vt = getTypeOfValue(value);

  if (type === 'xml') {
    if (!isXml(value)) {
      return ' The type of the value must be a"' + type + '".';
    }
  }

  if (type === 'float') {
    if (!vt.match(/^(float|integer)$/)) {
      return ' The type of the value must be a "' + type + '".';
    }
  } else {
    if (vt !== type && type !== 'xml') {
      return ' The type of the value must be a "' + type + '".';
    }
  }

  if (!allowEmpty) {
    if (vt === 'array' && value.length === 0) {
      return ' The value must not be an empty array.';
    } else if (vt === 'string' && value === '') {
      return ' The value must not be an empty string.';
    }
  }

  if (typeof value === 'string') {
    if (value.match(/[^\x20-\x7e]/)) {
      return ' The value must consist of ascii characters.';
    } else if (type !== 'xml' && value.match(/[\<\>]/)) {
        return ' Invalid characters were found in the value ("<", ">")';
      } else if (type === 'xml' && !value.match(/[\<\>]/)) {
          return ' Valid characters were found in the value for xml ("<", ">")';
        }
  }

  return '';
}

const functions = {
  isValidCallback,
  execCallback,
  createUuidV4,
  getTypeOfValue,
  isInvalidValue,
  isXml
};
module.exports = functions;