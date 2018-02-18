[![CircleCI](https://circleci.com/gh/hawkeye64/onvif-nvt.svg?style=svg)](https://circleci.com/gh/hawkeye64/onvif-nvt)
[![Coverage Status](https://coveralls.io/repos/github/hawkeye64/onvif-nvt/badge.svg?branch=master)](https://coveralls.io/github/hawkeye64/onvif-nvt?branch=master)
[![Dependency Status](https://david-dm.org/hawkeye64/onvif-nvt.svg)](https://david-dm.org/hawkeye64/onvif-nvt)

# onvif-nvt
ONVIF library for NVT (Network Video Transmitter) devices.

This package is written with Javascript classes and ES6. Both Promises and Callbacks are supported.

The aim of the **onvif-nvt** package is to have as much complete coverage of the [ONVIF](https://www.onvif.org/) spec as possible.

The `onvif-nvt` package will work only with `node` server-side. Ultimately, you would use sockets to communicate between a client and server the desired ONVIF commands.

## Installation
Note: This is a work-in-progress (Pre-Release), and while so, there will be many updates. PRs are welcomed.

```npm install onvif-nvt```

## Sample Application
You can find the sample application that uses Vue and Quasar [here](https://github.com/hawkeye64/onvif-nvt-snapshot-vue-sample)

## Contributing
Before making a PR please do the following:
* Make sure you are consistent with style.
* <i>npm run lint-fix</i>
* Make sure you have updated any functionality with JSDoc notations.
* <i>npm run jsdoc</i>
* Make sure you have added to <i>run</i> tests (live testing).
* If you have a specific camera not identified, create a folder for it in `test/data/xml/{camera}`. Create configuration data for it in `run.config.js`. Run all <i>run</i> tests with `saveXml.setWritable(true)` (in `run.js`) and capture all the xml.
* Make sure you have added to <i>jest</i> tests (uses the aforementioned xml). Update `test/config.js` with your camera.
* <i>node run/run.js</i>
* <i>npm run test</i>
If all is well, make the PR.

## Available Functionality
* Core (Device)
  * Discovery Mode, Device Information, System Date and Time, Scopes, Services, Capabilities, ServiceCapabilities, DNS, Network, Reboot, Backup, Restore, GeoLocation, Certificates, Relay, Remote User and many more.
* PTZ
  * Nodes, Configuration, Absolute move, Relative move, Continuous move, Geo move, Stop, Status, Presets, Home Position, and Auxillary Commands.
* Media
  * Profiles, Video/Audio/PTZ/Analytics/Metadata Configurations, Video sources, Audio sources, Stream Uri, Snapshot Uri, Multicast, and OSD.
* Snapshot
  * Using the **snapshot** module, you can retrieve snapshots from the device.
* Other modules
  * Access, Access Rules, Action, Analytics, Credential, DeviceIO, Display, Door, Events, Imaging, Media2, Receiver, Recording, Replay, Schedule, Search, Security, Thermal and Video Analytics.

The library is made in such a way that only modules that will work with your device are automatically included. For others, you can choose whether or not to bring in the functionality.

## Example (Discovery)
``` cs
const OnvifManager = require('onvif-nvt')
OnvifManager.add('discovery')
OnvifManager.discovery.startProbe().then(deviceList => {
 console.log(deviceList)
 // 'deviceList' contains all ONVIF devices that have responded.
 // If it is empty, then no ONVIF devices
 // responded back to the broadcast.
})
```

## Example (Connect and Continuous Move)
``` cs
const OnvifManager = require('onvif-nvt')
OnvifManager.connect('10.10.1.60', 80, 'username', 'password')
  .then(results => {
    let camera = results
    if (camera.ptz) { // PTZ is supported on this device
      let velocity = { x: 1, y: 0 }
      camera.ptz.continuousMove(null, velocity)
        .then(() => {
          setTimeout(() => {
            camera.ptz.stop()
          }, 5000) // stop the camera after 5 seconds
        })
    }
  })
```

## Example (Snapshot)
``` cs
const OnvifManager = require('onvif-nvt')
OnvifManager.connect('10.10.1.60', 80, 'username', 'password')
  .then(results => {
    let camera = results
    // calling add method will automatically initialize snapshot
    // with the defaultProfile's snapshotUri
    camera.add('snapshot')
    camera.snapshot.getSnapshot()
      .then(results => {
        let mimeType = results.mimeType
        let rawImage = results.image
        let prefix = 'data:' + mimeType + ';base64,'
        let base64Image = Buffer.from(rawImage, 'binary').toString('base64')
        let image = prefix + base64Image
        // 'image' is now ready to be displayed on a web page
        // ...
      })
    }
  })
```

## Documentation
[onvif-nvt documentation](https://hawkeye64.github.io/onvif-nvt/)

## Testing
Note: The code for testing is not available in the npm package.

All functionality has been tested with Hikvision (fixed and ptz), Pelco (ptz), TrendNET (fixed) and Axis (ptz).

### Functional Testing
Functional testing is intended for 'live' testing with an actual ONVIF device. It is done with the `run.js` in the `run` folder. This will test the actual capabilities of a camera, but just as importantly, it can capture the xml response to file so it can be used in Jest tests. The configuration file for the `run` tests can be found in `run/config.js`.

For **discovery** testing, just set the `runDiscovery` variable at the top of the file to `true`.

For **core** testing, set the `runCore` variable at the top of the file.

You can do this for other modules as well. See file for options.

Set up your local camera by setting the appropriate variables in `run/config.js`, like this:
```
const address = '10.10.1.60'
const port = 80
const username = 'root'
const password = 'root'
const folder = 'hikvision'
```
Run the `run.js` file via node (personally, I use VS Code - an amazing editor/debugger).

The tests will only run onvif modules supported by the camera capabilities, so if it doesn't support PTZ, then the PTZ tests won't be run. Same for other modules.

Your mileage may vary as I have found some ONVIF devices don't support very basic functionality, like `GetSystemDateAndTime`. In some cases, you might get a response back of `Action not supported`. If this happens, then the tests will fail. This is nothing to be alarmed about. You may also get other errors. The most common I see is if your camera does not support audio configurations. Also, you may get a `Not Implemented` error, meaning the implementation of that method has not yet been added.

### Automated Testing
**Jest** is being used to do the automated testing and code coverage. All tests are in the `tests` folder, as well as XML Requests and Responses from various ONVIF devices.
To start the tests, run the following:
```npm run test```

Inside the `test` folder is a `config.js` file where you can set options for the tests.

## Request
`onvif-nvt` uses `request` for device communication. Some people may believe this is too *heavy* of a package and that *http* should be used instead. `request` works quite well with HTTP digest and digest realm scenarios. In a lot of cases, this is needed for `snapshot` access. However, I am finding some ONVIF devices that allow you to turn on HTTP security (besides the ONVIF user token security) which provides a double layer (albeit, with the same username and password). It is these cases where `request` *just works*.
