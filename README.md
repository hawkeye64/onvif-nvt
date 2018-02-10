# onvif-nvt
ONVIF library for NVT (Network Video Transmitter) devices.

This package is written with Javascript classes and ES6. Both Promises and Callbacks are supported.

The aim of the **onvif-nvt** package is to have as much complete coverage of the [ONVIF](https://www.onvif.org/) spec as possible.

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
  * Using the **snapshot** module, you can retrieve ssnapshots from the device.
* Other modules
  * Access, Access Rules, Action, Analytics, Credential, DeviceIO, Display, Door, Events, Imaging, Media2, Receiver, Recording, Replay, Schedule, Search, Security, Thermal and Video Analytics.

The library is made in such a way that only modules that will work with your device are automatically included. For others, you can choose whether or not to bring in the functionality.

## Example (Discovery)
```
const OnvifManager = require('onvif-nvt')
OnvifManager.add('discovery')
OnvifManager.discovery.startProbe().then(deviceList => {
 console.log(deviceList)
})
```
## Example (Connect and Move)
```
const OnvifManager = require('onvif-nvt')
OnvifManager.connect('10.10.1.60', 80, 'admin', '12345')
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

## Documentation
[onvif-nvt documentation](https://hawkeye64.github.io/onvif-nvt/)
