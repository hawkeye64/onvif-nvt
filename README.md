# onvif-nvt
ONVIF library for NVT (Network Video Transmitter) devices.

This package is written with Javascript classes and ES6. Both Promises and Callbacks are supported.

The aim of the **onvif-nvt** package is to have as much complete coverage of the [ONVIF](https://www.onvif.org/) spec as possible.

The `onvif-nvt` package will work only with `node` server-side. Ultimately, you would use sockets to communicate between a client and server the desired ONVIF commands.

## Installation
onvif-nvt is not available via npm (yet!) while some of the functionality is being worked on. Once common functionality is hit, it will be released to npm. 
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
```
const OnvifManager = require('onvif-nvt')
OnvifManager.add('discovery')
OnvifManager.discovery.startProbe().then(deviceList => {
 console.log(deviceList)
 // 'deviceList' contains all ONVIF devices that have responded.
 // If it is empty, then no ONVIF devices
 // responded back to the broadcst.
})
```
## Example (Connect and Continuous Move)
```
const OnvifManager = require('onvif-nvt')
OnvifManager.connect('10.10.1.60', 80, 'username', 'password')
  .then(results => {
    let camera = results
    if (camera.ptz) { // PTZ is supported on this device
      let velocity = { x: 1, y: 0 }
      camera.ptz.continuousMove(null, velocity)
        .then(() => {
          setTimeout(() => {
            ptz.stop()
          }, 5000) // stop the camera after 5 seconds
        })
    }
  })
```
## Example (Snapshot)
```
const OnvifManager = require('onvif-nvt')
OnvifManager.connect('10.10.1.60', 80, 'username', 'password')
  .then(results => {
    let camera = results
    // calling add method will automatically initialize snapshot
    // with the defaultProfile's snapshotUri
    camera.add('snapshot)
    camera.snapshot.getSnapshot()
      .then(results => {
        let mimeType = results.mimeType
        let rawImage = results.image
        let prefix = 'data:' + mimeType + ';base64,'
        let base64Image = Buffer.from(rawImage, 'binary').toString('base64')
        let image = prefix + base64Image
        // 'image' is now ready to be displayed on a web page
        ...
      })
    }
  })
```

## Documentation
[onvif-nvt documentation](https://hawkeye64.github.io/onvif-nvt/)

## Testing
All functionality has been tested with Hikvision (fixed and ptz), Pelco (ptz), TrendNET (fixed) and Axis (ptz).

### Functional Testing
Functional testing is intended for 'live' testing with an actual ONVIF device. It is done with the `run.js` in the `run` folder. 

For **discovery** testing, just set the `runDiscovery` variable at the top of the file to `true`.

For **core** testing, set the `runCore` variable at the top of the file.

You can do this for other modules as well. See file for options.

Set up your local camera by setting the appropriate variables near the top of the file, like this:
```
const address = '192.168.0.19'
const port = 80
const username = 'root'
const password = 'root'
```
Run the `run.js` file via node (personally, I use VS Code - an amazing editor/debugger).

The tests will only run what the camera supports, so if it doesn't support PTZ, then the PTZ tests won't be run. Same for other modules.

Your mileage may vary as I have found some ONVIF devices don't support very basic functionality, like `GetSystemDateAndTime`. In some cases, you might get a response back of `Action not supported`. If this happens, then the tests will fail. You can comment out the call to the part that is failing and re-run the tests.

### Automated Testing
**Jest** is being used to do the automated testing and code coverage. All tests are in the `tests` folder, as well as XML Requests and Responses from various ONVIF devices.
To start the tests, run the following:
```npm run test```

Inside the `test` folder is a `config.js` file where you can set options for the tests.

## Request
`onvif-nvt` uses `request` for device communication. Some people may believe this is too *heavy* of a package and that *http* should be used instead. `request` works quite well with HTTP digest and digest realm scenarios. In a lot of cases, this is needed for `snapshot` access. However, I am finding some ONVIF devices that allow you to turn on HTTP security (besides the ONVIF user token security) which provides a double layer (albeit, with the same username and password. It is these cases where `request` *just works*.