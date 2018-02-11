'use strict'

// const Fs = require('fs')
// const Path = require('path')
// const Soap = require('../lib/utils/soap')
const Config = require('./config')

describe(`OnvifManager.Discovery (${Config.cameraType})`, () => {
  test('Discovery::parseResult', () => {
    // const OnvifManager = require('../lib/onvif-nvt')
    // OnvifManager.add('discovery')

    // let xml = Fs.readFileSync(Path.resolve(__dirname, './data/xml/axis/discovery.results.xml'), 'utf8')
    // // console.log('xml', xml)

    // return Soap.parse(xml)
    //   .then(results => {
    //     // set up _devices in lieu of startProbe
    //     OnvifManager.discovery._devices = {}
    //     let probe = OnvifManager.discovery.parseResult(results)

    //     expect(probe.urn).toEqual('urn:uuid:29a09995-0ece-496a-8d97-9839dcec9822')
    //     expect(probe.name).toEqual('AXIS%20Q6045-E')
    //     expect(probe.hardware).toEqual('Q6045-E')
    //     expect(probe.location).toEqual('')
    //     expect(probe.types).toHaveLength(1)
    //     expect(probe.types[0]).toEqual('dn:NetworkVideoTransmitter')
    //     expect(probe.xaddrs).toHaveLength(4)
    //     expect(probe.scopes).toHaveLength(7)
    //   })
    //   .catch(error => {
    //     console.error(error)
    //   })
  })

  // test('Discovery::startProbe', () => {
  //   jest.mock('dgram')
  //   const OnvifManager = require('../lib/onvif-nvt')
  //   OnvifManager.add('discovery')
  // });

  // test('Discovery::stopProbe', () => {
  //   // jest.mock('dgram')
  //   // const dgram = require('dgram')
  //   const OnvifManager = require('../lib/onvif-nvt')
  //   OnvifManager.add('discovery')
  //   // set up
  //   OnvifManager.discovery._discoveryIntervalTimer = 1
  //   OnvifManager.discovery._discoveryWaitTimer = 1
  //   // OnvifManager.discovery._udp = dgram.createSocket('udp4')
  //   // call the function
  //   OnvifManager.discovery.stopProbe()
  //     .then(results => {
  //       // test
  //       expect(OnvifManager.discovery._discoveryIntervalTimer).toBeNull()
  //       expect(OnvifManager.discovery._discoveryWaitTimer).toBeNull()
  //       // expect(OnvifManager.discovery._udp).toBeNull()
  //     })
  // });
})
