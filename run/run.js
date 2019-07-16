/* -------------------------------------------------
  NOTE: I use this code to interactively test with
  a real camera for each new method as it is written.
  ------------------------------------------------- */

const Config = require('./config')
const saveXml = require('../lib/utils/save-xml')
// Uncomment to save XML Requests and Resonses
saveXml.setWritable(true)

let apiErrors = []

function run () {
  console.log(`Interactively testing with '${Config.folder}' at address: ${Config.address}`)

  testCore().then(() => {
    return testPtz()
  }).then(() => {
    return testMedia()
  }).then(() => {
    return testEvents()
  }).then(() => {
    return testAnalytics()
  }).then(() => {
    return testSnapshot()
  }).then(() => {
    // this should be the last test (obviously)
    return testCoreSystemReboot()
  }).then(() => {
    const count = apiErrors.length
    if (count) {
      console.error(`All tests ran, ${count} failed`)
      apiErrors.forEach(api => {
        console.error(`  - ${api}`)
      })
      console.error(' * See above for fault information')
      console.error(' * Just because an API errored, does not indicate an issue with the code.')
      console.error(' * Some cameras do not support various functions. This is expected.')
      console.error(' * It helps to know the capabilities of your specific camera.')
      console.error(' * It may also be that the functionality has not been completed.')
      console.error(' * If this is the case and affects you, PRs are welcomed.')
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
    const RunCore = require('./run.core')
    RunCore.run()
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
    const RunPtz = require('./run.ptz')
    RunPtz.run()
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
    const RunMedia = require('./run.media')
    RunMedia.run()
      .then(results => {
        apiErrors = apiErrors.concat(results)
        resolve(results)
      })
      .catch(error => {
        console.error(error)
      })
  })
}

function testEvents () {
  return new Promise((resolve, reject) => {
    const RunEvents = require('./run.events')
    RunEvents.run()
      .then(results => {
        apiErrors = apiErrors.concat(results)
        resolve(results)
      })
      .catch(error => {
        console.error(error)
      })
  })
}

function testAnalytics () {
  return new Promise((resolve, reject) => {
    const RunAnalytics = require('./run.analytics')
    RunAnalytics.run()
      .then(results => {
        apiErrors = apiErrors.concat(results)
        resolve(results)
      })
      .catch(error => {
        console.error(error)
      })
  })
}

function testSnapshot () {
  return new Promise((resolve, reject) => {
    const RunSnapshot = require('./run.snapshot')
    RunSnapshot.run()
      .then(results => {
        apiErrors = apiErrors.concat(results)
        resolve(results)
      })
      .catch(error => {
        console.error(error)
      })
  })
}

function testCoreSystemReboot () {
  return new Promise((resolve, reject) => {
    const RunReboot = require('./run.reboot')
    RunReboot.run()
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
