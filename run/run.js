/* -------------------------------------------------
  NOTE: I use this code to interactively test with
  a real camera each new method as it is written.
  ------------------------------------------------- */

const saveXml = require('../lib/utils/save-xml')
// Uncomment to save XML Requests and Resonses
saveXml.setWritable(true)


const OnvifManager = require('../lib/onvif-nvt')

// variables using in functional testing below
let apiErrors = []
// let DynamicDNSType = ''
// let DynamicDNSName = ''
let profileToken = ''

function run() {
  testCore().then(() => {
    return testPtz()
  }).then(() => {
    return testMedia()
  }).then(() => {
    return testSnapshot()
  }).then(() => {
  //   // this should be the last test (obviously)
  //   return testCoreSystemReboot()
  // }).then(() => {
    let count = apiErrors.length
    if (count) {
      console.error(`All tests ran, ${count} failed`)
      apiErrors.forEach(api => {
        console.error(`  - ${api}`)
      })
      console.error(' * See above for fault information')
      console.error(' * Just because an API errored, does not indicate an issue with the code.')
      console.error(' * Some cameras do not support various functions. This is expected.')
      console.error(' * It helps to know the capabilities of your specific camera.')
    }
    else {
      console.log('All tests ran successfully')
    }
  }).catch(error => {
    console.error(error)
  })
}

function testCore () {
  return new Promise((resolve, reject) => {
    let runCore = require('./run.core')
    runCore.run()
      .then(results => {
        apiErrors = apiErrors.concat(results)
        resolve(results)
      })
      .catch(error => {
        console.error(error)
      })
  })
}

function testPtz () {
  return new Promise((resolve, reject) => {
    let runPtz = require('./run.ptz')
    runPtz.run()
      .then(results => {
        apiErrors = apiErrors.concat(results)
        resolve(results)
      })
      .catch(error => {
        console.error(error)
      })
  })
}

function testMedia () {
  return new Promise((resolve, reject) => {
    let runMedia = require('./run.media')
    runMedia.run()
      .then(results => {
        apiErrors = apiErrors.concat(results)
        resolve(results)
      })
      .catch(error => {
        console.error(error)
      })
  })
}

function testSnapshot (camera) {
  return new Promise((resolve, reject) => {
    let runSnapshot = require('./run.snapshot')
    runSnapshot.run()
      .then(results => {
        apiErrors = apiErrors.concat(results)
        resolve(results)
      })
      .catch(error => {
        console.error(error)
      })
  })
}

/* -------------------------------------------------
    NOTE: All functional test should resolve(error)
    instead of calling reject(error)
    ------------------------------------------------- */

// run it...
run()
