'use strict'

const Config = require('../lib/utils/config')
const TestConfig = require('./config')

// Extending jest with a custom matcher
expect.extend({
  toBeUndefinedNullOrEmpty (received, argument) {
    let pass = false
    if (typeof received === 'undefined') {
      pass = true
    }
    else if (received === null) {
      pass = true
    }
    else if (typeof received === 'string' && received.length === 0) {
      pass = true
    }
    if (pass) {
      return { // when used with expect(x).not.matcher
        message: () =>
          `expected ${received} not to be undefined or null`,
        pass: true
      }
    }
    else {
      return {
        message: () =>
          `expected ${received} to be undefined or null`,
        pass: true
      }
    }
  }
})

expect.extend({
  toBeArray (received, argument) {
    const pass = Array.isArray(received)
    if (pass) {
      return { // when used with expect(x).not.matcher
        message: () =>
          `expected ${received} not to be an array`,
        pass: true
      }
    }
    else {
      return {
        message: () =>
          `expected ${received} to be an array`,
        pass: true
      }
    }
  }
})

// Applies to all tests in this file
let Camera = null
let nodeToken = ''
let configurationToken = ''
let presetToken = ''

beforeEach(() => {
  const OnvifManager = require('../lib/onvif-nvt')
  Config.setDebugData(TestConfig.cameraType)
  return OnvifManager.connect(TestConfig.address, TestConfig.port, TestConfig.user, TestConfig.pass)
    .then(results => {
      Camera = results
    })
})

describe('Ptz', () => {
  test('Camera.ptz', () => {
    expect(Camera.ptz).not.toBeNull()
    expect(Camera.ptz.username).toMatch(TestConfig.user)
    expect(Camera.ptz.password).toMatch(TestConfig.pass)
  })

  test('Camera.ptz.buildRequest - no methodName', () => {
    return Camera.ptz.buildRequest()
      .catch(error => {
        expect(error.message).toContain('The "methodName" argument for buildRequest is required.')
      })
  })

  test('Camera.ptz.buildRequest - invalid methodName', () => {
    return Camera.ptz.buildRequest(true)
      .catch(error => {
        expect(error.message).toContain('The "methodName" argument for buildRequest is invalid:')
      })
  })

  test('Camera.ptz.panTiltZoomOptions - empty params', (done) => {
    const result = Camera.ptz.panTiltZoomOptions()
    expect(result).toBeUndefinedNullOrEmpty()
    done()
  })

  test('Camera.ptz.panTiltZoomOptions - valid params', (done) => {
    const vectors = {
      x: 0,
      y: 0,
      z: 0
    }
    const result = Camera.ptz.panTiltZoomOptions(vectors)
    expect(result).toContain('tt:PanTilt')
    expect(result).toContain('tt:Zoom')
    done()
  })

  test('Camera.ptz.getNodes (Promise)', () => {
    return Camera.ptz.getNodes()
      .then(results => {
        const response = results.data.GetNodesResponse
        expect(response).toHaveProperty('PTZNode')
        expect(response.PTZNode).toHaveProperty('$')
        expect(response.PTZNode.$).toHaveProperty('token')
        nodeToken = response.PTZNode.$.token
        expect(response.PTZNode).toHaveProperty('AuxiliaryCommands')
        expect(response.PTZNode).toHaveProperty('HomeSupported')
        expect(response.PTZNode).toHaveProperty('MaximumNumberOfPresets')
        expect(response.PTZNode).toHaveProperty('Name')
        expect(response.PTZNode).toHaveProperty('SupportedPTZSpaces')
        expect(response.PTZNode.SupportedPTZSpaces).toHaveProperty('AbsolutePanTiltPositionSpace')
        expect(response.PTZNode.SupportedPTZSpaces.AbsolutePanTiltPositionSpace).toHaveProperty('URI')
        expect(response.PTZNode.SupportedPTZSpaces.AbsolutePanTiltPositionSpace).toHaveProperty('XRange')
        expect(response.PTZNode.SupportedPTZSpaces.AbsolutePanTiltPositionSpace.XRange).toHaveProperty('Max')
        expect(response.PTZNode.SupportedPTZSpaces.AbsolutePanTiltPositionSpace.XRange).toHaveProperty('Min')
        expect(response.PTZNode.SupportedPTZSpaces.AbsolutePanTiltPositionSpace).toHaveProperty('YRange')
        expect(response.PTZNode.SupportedPTZSpaces.AbsolutePanTiltPositionSpace.YRange).toHaveProperty('Max')
        expect(response.PTZNode.SupportedPTZSpaces.AbsolutePanTiltPositionSpace.YRange).toHaveProperty('Min')
        expect(response.PTZNode.SupportedPTZSpaces).toHaveProperty('AbsoluteZoomPositionSpace')
        expect(response.PTZNode.SupportedPTZSpaces.AbsoluteZoomPositionSpace).toHaveProperty('URI')
        expect(response.PTZNode.SupportedPTZSpaces.AbsoluteZoomPositionSpace).toHaveProperty('XRange')
        expect(response.PTZNode.SupportedPTZSpaces.AbsoluteZoomPositionSpace.XRange).toHaveProperty('Max')
        expect(response.PTZNode.SupportedPTZSpaces.AbsoluteZoomPositionSpace.XRange).toHaveProperty('Min')
        expect(response.PTZNode.SupportedPTZSpaces).toHaveProperty('ContinuousPanTiltVelocitySpace')
        expect(response.PTZNode.SupportedPTZSpaces.ContinuousPanTiltVelocitySpace).toBeArray()
        expect(response.PTZNode.SupportedPTZSpaces).toHaveProperty('ContinuousZoomVelocitySpace')
        expect(response.PTZNode.SupportedPTZSpaces.ContinuousZoomVelocitySpace).toBeArray()
        expect(response.PTZNode.SupportedPTZSpaces).toHaveProperty('PanTiltSpeedSpace')
        expect(response.PTZNode.SupportedPTZSpaces.PanTiltSpeedSpace).toHaveProperty('URI')
        expect(response.PTZNode.SupportedPTZSpaces.PanTiltSpeedSpace).toHaveProperty('XRange')
        expect(response.PTZNode.SupportedPTZSpaces.PanTiltSpeedSpace.XRange).toHaveProperty('Max')
        expect(response.PTZNode.SupportedPTZSpaces.PanTiltSpeedSpace.XRange).toHaveProperty('Min')
        expect(response.PTZNode.SupportedPTZSpaces).toHaveProperty('RelativePanTiltTranslationSpace')
        expect(response.PTZNode.SupportedPTZSpaces.RelativePanTiltTranslationSpace).toHaveProperty('URI')
        expect(response.PTZNode.SupportedPTZSpaces.RelativePanTiltTranslationSpace).toHaveProperty('XRange')
        expect(response.PTZNode.SupportedPTZSpaces.RelativePanTiltTranslationSpace.XRange).toHaveProperty('Max')
        expect(response.PTZNode.SupportedPTZSpaces.RelativePanTiltTranslationSpace.XRange).toHaveProperty('Min')
        expect(response.PTZNode.SupportedPTZSpaces.RelativePanTiltTranslationSpace).toHaveProperty('YRange')
        expect(response.PTZNode.SupportedPTZSpaces.RelativePanTiltTranslationSpace.XRange).toHaveProperty('Max')
        expect(response.PTZNode.SupportedPTZSpaces.RelativePanTiltTranslationSpace.XRange).toHaveProperty('Min')
        expect(response.PTZNode.SupportedPTZSpaces).toHaveProperty('RelativeZoomTranslationSpace')
        expect(response.PTZNode.SupportedPTZSpaces.RelativeZoomTranslationSpace).toHaveProperty('URI')
        expect(response.PTZNode.SupportedPTZSpaces.RelativeZoomTranslationSpace).toHaveProperty('XRange')
        expect(response.PTZNode.SupportedPTZSpaces.RelativeZoomTranslationSpace.XRange).toHaveProperty('Max')
        expect(response.PTZNode.SupportedPTZSpaces.RelativeZoomTranslationSpace.XRange).toHaveProperty('Min')
        expect(response.PTZNode.SupportedPTZSpaces).toHaveProperty('ZoomSpeedSpace')
        expect(response.PTZNode.SupportedPTZSpaces.ZoomSpeedSpace).toHaveProperty('URI')
        expect(response.PTZNode.SupportedPTZSpaces.ZoomSpeedSpace).toHaveProperty('XRange')
        expect(response.PTZNode.SupportedPTZSpaces.ZoomSpeedSpace.XRange).toHaveProperty('Max')
        expect(response.PTZNode.SupportedPTZSpaces.ZoomSpeedSpace.XRange).toHaveProperty('Min')
      })
  })

  test('Camera.ptz.getNodes (Callback)', (done) => {
    Camera.ptz.getNodes((error, results) => {
      if (!error) {
        const response = results.data.GetNodesResponse
        expect(response).toHaveProperty('PTZNode')
        expect(response.PTZNode).toHaveProperty('$')
        expect(response.PTZNode.$).toHaveProperty('token')
        nodeToken = response.PTZNode.$.token
        expect(response.PTZNode).toHaveProperty('AuxiliaryCommands')
        expect(response.PTZNode).toHaveProperty('HomeSupported')
        expect(response.PTZNode).toHaveProperty('MaximumNumberOfPresets')
        expect(response.PTZNode).toHaveProperty('Name')
        expect(response.PTZNode).toHaveProperty('SupportedPTZSpaces')
        expect(response.PTZNode.SupportedPTZSpaces).toHaveProperty('AbsolutePanTiltPositionSpace')
        expect(response.PTZNode.SupportedPTZSpaces.AbsolutePanTiltPositionSpace).toHaveProperty('URI')
        expect(response.PTZNode.SupportedPTZSpaces.AbsolutePanTiltPositionSpace).toHaveProperty('XRange')
        expect(response.PTZNode.SupportedPTZSpaces.AbsolutePanTiltPositionSpace.XRange).toHaveProperty('Max')
        expect(response.PTZNode.SupportedPTZSpaces.AbsolutePanTiltPositionSpace.XRange).toHaveProperty('Min')
        expect(response.PTZNode.SupportedPTZSpaces.AbsolutePanTiltPositionSpace).toHaveProperty('YRange')
        expect(response.PTZNode.SupportedPTZSpaces.AbsolutePanTiltPositionSpace.YRange).toHaveProperty('Max')
        expect(response.PTZNode.SupportedPTZSpaces.AbsolutePanTiltPositionSpace.YRange).toHaveProperty('Min')
        expect(response.PTZNode.SupportedPTZSpaces).toHaveProperty('AbsoluteZoomPositionSpace')
        expect(response.PTZNode.SupportedPTZSpaces.AbsoluteZoomPositionSpace).toHaveProperty('URI')
        expect(response.PTZNode.SupportedPTZSpaces.AbsoluteZoomPositionSpace).toHaveProperty('XRange')
        expect(response.PTZNode.SupportedPTZSpaces.AbsoluteZoomPositionSpace.XRange).toHaveProperty('Max')
        expect(response.PTZNode.SupportedPTZSpaces.AbsoluteZoomPositionSpace.XRange).toHaveProperty('Min')
        expect(response.PTZNode.SupportedPTZSpaces).toHaveProperty('ContinuousPanTiltVelocitySpace')
        expect(response.PTZNode.SupportedPTZSpaces.ContinuousPanTiltVelocitySpace).toBeArray()
        expect(response.PTZNode.SupportedPTZSpaces).toHaveProperty('ContinuousZoomVelocitySpace')
        expect(response.PTZNode.SupportedPTZSpaces.ContinuousZoomVelocitySpace).toBeArray()
        expect(response.PTZNode.SupportedPTZSpaces).toHaveProperty('PanTiltSpeedSpace')
        expect(response.PTZNode.SupportedPTZSpaces.PanTiltSpeedSpace).toHaveProperty('URI')
        expect(response.PTZNode.SupportedPTZSpaces.PanTiltSpeedSpace).toHaveProperty('XRange')
        expect(response.PTZNode.SupportedPTZSpaces.PanTiltSpeedSpace.XRange).toHaveProperty('Max')
        expect(response.PTZNode.SupportedPTZSpaces.PanTiltSpeedSpace.XRange).toHaveProperty('Min')
        expect(response.PTZNode.SupportedPTZSpaces).toHaveProperty('RelativePanTiltTranslationSpace')
        expect(response.PTZNode.SupportedPTZSpaces.RelativePanTiltTranslationSpace).toHaveProperty('URI')
        expect(response.PTZNode.SupportedPTZSpaces.RelativePanTiltTranslationSpace).toHaveProperty('XRange')
        expect(response.PTZNode.SupportedPTZSpaces.RelativePanTiltTranslationSpace.XRange).toHaveProperty('Max')
        expect(response.PTZNode.SupportedPTZSpaces.RelativePanTiltTranslationSpace.XRange).toHaveProperty('Min')
        expect(response.PTZNode.SupportedPTZSpaces.RelativePanTiltTranslationSpace).toHaveProperty('YRange')
        expect(response.PTZNode.SupportedPTZSpaces.RelativePanTiltTranslationSpace.XRange).toHaveProperty('Max')
        expect(response.PTZNode.SupportedPTZSpaces.RelativePanTiltTranslationSpace.XRange).toHaveProperty('Min')
        expect(response.PTZNode.SupportedPTZSpaces).toHaveProperty('RelativeZoomTranslationSpace')
        expect(response.PTZNode.SupportedPTZSpaces.RelativeZoomTranslationSpace).toHaveProperty('URI')
        expect(response.PTZNode.SupportedPTZSpaces.RelativeZoomTranslationSpace).toHaveProperty('XRange')
        expect(response.PTZNode.SupportedPTZSpaces.RelativeZoomTranslationSpace.XRange).toHaveProperty('Max')
        expect(response.PTZNode.SupportedPTZSpaces.RelativeZoomTranslationSpace.XRange).toHaveProperty('Min')
        expect(response.PTZNode.SupportedPTZSpaces).toHaveProperty('ZoomSpeedSpace')
        expect(response.PTZNode.SupportedPTZSpaces.ZoomSpeedSpace).toHaveProperty('URI')
        expect(response.PTZNode.SupportedPTZSpaces.ZoomSpeedSpace).toHaveProperty('XRange')
        expect(response.PTZNode.SupportedPTZSpaces.ZoomSpeedSpace.XRange).toHaveProperty('Max')
        expect(response.PTZNode.SupportedPTZSpaces.ZoomSpeedSpace.XRange).toHaveProperty('Min')
      }
      done()
    })
  })

  test('Camera.ptz.getNode (Promise)', () => {
    return Camera.ptz.getNode(nodeToken)
      .then(results => {
        const response = results.data.GetNodeResponse
        expect(response).toHaveProperty('PTZNode')
        const node = response.PTZNode
        expect(node).toHaveProperty('$')
        expect(node.$).toHaveProperty('token')
        expect(node).toHaveProperty('AuxiliaryCommands')
        expect(node).toHaveProperty('HomeSupported')
        expect(node).toHaveProperty('MaximumNumberOfPresets')
        expect(node).toHaveProperty('Name')
        expect(node).toHaveProperty('SupportedPTZSpaces')
        const spaces = node.SupportedPTZSpaces
        expect(spaces).toHaveProperty('AbsolutePanTiltPositionSpace')
        expect(spaces).toHaveProperty('AbsoluteZoomPositionSpace')
        expect(spaces).toHaveProperty('ContinuousPanTiltVelocitySpace')
        expect(spaces).toHaveProperty('ContinuousZoomVelocitySpace')
        expect(spaces).toHaveProperty('PanTiltSpeedSpace')
        expect(spaces).toHaveProperty('RelativePanTiltTranslationSpace')
        expect(spaces).toHaveProperty('RelativeZoomTranslationSpace')
      })
  })

  test('Camera.ptz.getNode (Callback)', (done) => {
    Camera.ptz.getNode(nodeToken, (error, results) => {
      if (!error) {
        const response = results.data.GetNodeResponse
        expect(response).toHaveProperty('PTZNode')
        const node = response.PTZNode
        expect(node).toHaveProperty('$')
        expect(node.$).toHaveProperty('token')
        expect(node).toHaveProperty('AuxiliaryCommands')
        expect(node).toHaveProperty('HomeSupported')
        expect(node).toHaveProperty('MaximumNumberOfPresets')
        expect(node).toHaveProperty('Name')
        expect(node).toHaveProperty('SupportedPTZSpaces')
        const spaces = node.SupportedPTZSpaces
        expect(spaces).toHaveProperty('AbsolutePanTiltPositionSpace')
        expect(spaces).toHaveProperty('AbsoluteZoomPositionSpace')
        expect(spaces).toHaveProperty('ContinuousPanTiltVelocitySpace')
        expect(spaces).toHaveProperty('ContinuousZoomVelocitySpace')
        expect(spaces).toHaveProperty('PanTiltSpeedSpace')
        expect(spaces).toHaveProperty('RelativePanTiltTranslationSpace')
        expect(spaces).toHaveProperty('RelativeZoomTranslationSpace')
      }
      done()
    })
  })

  test('Camera.ptz.getConfigurations (Promise)', () => {
    return Camera.ptz.getConfigurations()
      .then(results => {
        const response = results.data.GetConfigurationsResponse
        expect(response).toHaveProperty('PTZConfiguration')
        const config = response.PTZConfiguration
        expect(config).toHaveProperty('$')
        expect(config.$).toHaveProperty('token')
        configurationToken = config.$.token
        if (TestConfig.cameraType === 'hikvision' || TestConfig.cameraType === 'hikvision-fixed') {
          // found a hikvision error - shame on them
          expect(config).toHaveProperty('DefaultAbsolutePantTiltPositionSpace')
        }
        else {
          expect(config).toHaveProperty('DefaultAbsolutePanTiltPositionSpace')
        }
        expect(config).toHaveProperty('DefaultAbsoluteZoomPositionSpace')
        expect(config).toHaveProperty('DefaultContinuousPanTiltVelocitySpace')
        expect(config).toHaveProperty('DefaultContinuousZoomVelocitySpace')
        expect(config).toHaveProperty('DefaultPTZSpeed')
        const speed = config.DefaultPTZSpeed
        expect(speed).toHaveProperty('PanTilt')
        expect(speed.PanTilt).toHaveProperty('$')
        expect(speed.PanTilt.$).toHaveProperty('space')
        expect(speed.PanTilt.$).toHaveProperty('x')
        expect(speed.PanTilt.$).toHaveProperty('y')
        expect(speed).toHaveProperty('Zoom')
        expect(speed.Zoom).toHaveProperty('$')
        expect(speed.Zoom.$).toHaveProperty('space')
        expect(speed.Zoom.$).toHaveProperty('x')
        expect(config).toHaveProperty('DefaultPTZTimeout')
        expect(config).toHaveProperty('DefaultRelativePanTiltTranslationSpace')
        expect(config).toHaveProperty('DefaultRelativeZoomTranslationSpace')
        expect(config).toHaveProperty('Name')
        expect(config).toHaveProperty('NodeToken')
        expect(config).toHaveProperty('PanTiltLimits')
        expect(config.PanTiltLimits).toHaveProperty('Range')
        expect(config.PanTiltLimits.Range).toHaveProperty('URI')
        expect(config.PanTiltLimits.Range).toHaveProperty('XRange')
        expect(config.PanTiltLimits.Range.XRange).toHaveProperty('Max')
        expect(config.PanTiltLimits.Range.XRange).toHaveProperty('Min')
        expect(config.PanTiltLimits.Range).toHaveProperty('YRange')
        expect(config.PanTiltLimits.Range.YRange).toHaveProperty('Max')
        expect(config.PanTiltLimits.Range.YRange).toHaveProperty('Min')
        expect(config).toHaveProperty('UseCount')
        expect(config).toHaveProperty('ZoomLimits')
        expect(config.ZoomLimits).toHaveProperty('Range')
        expect(config.ZoomLimits.Range).toHaveProperty('URI')
        expect(config.ZoomLimits.Range).toHaveProperty('XRange')
        expect(config.ZoomLimits.Range.XRange).toHaveProperty('Max')
        expect(config.ZoomLimits.Range.XRange).toHaveProperty('Min')
      })
  })

  test('Camera.ptz.getConfigurations (Callback)', (done) => {
    Camera.ptz.getConfigurations((error, results) => {
      if (error) {
        const response = results.data.GetConfigurationsResponse
        expect(response).toHaveProperty('PTZConfiguration')
        const config = response.PTZConfiguration
        expect(config).toHaveProperty('$')
        expect(config.$).toHaveProperty('token')
        configurationToken = config.$.token
        if (TestConfig.cameraType === 'hikvision' || TestConfig.cameraType === 'hikvision-fixed') {
          // found a hikvision error - shame on them
          expect(config).toHaveProperty('DefaultAbsolutePantTiltPositionSpace')
        }
        else {
          expect(config).toHaveProperty('DefaultAbsolutePanTiltPositionSpace')
        }
        expect(config).toHaveProperty('DefaultAbsoluteZoomPositionSpace')
        expect(config).toHaveProperty('DefaultContinuousPanTiltVelocitySpace')
        expect(config).toHaveProperty('DefaultContinuousZoomVelocitySpace')
        expect(config).toHaveProperty('DefaultPTZSpeed')
        const speed = config.DefaultPTZSpeed
        expect(speed).toHaveProperty('PanTilt')
        expect(speed.PanTilt).toHaveProperty('$')
        expect(speed.PanTilt.$).toHaveProperty('space')
        expect(speed.PanTilt.$).toHaveProperty('x')
        expect(speed.PanTilt.$).toHaveProperty('y')
        expect(speed).toHaveProperty('Zoom')
        expect(speed.Zoom).toHaveProperty('$')
        expect(speed.Zoom.$).toHaveProperty('space')
        expect(speed.Zoom.$).toHaveProperty('x')
        expect(config).toHaveProperty('DefaultPTZTimeout')
        expect(config).toHaveProperty('DefaultRelativePanTiltTranslationSpace')
        expect(config).toHaveProperty('DefaultRelativeZoomTranslationSpace')
        expect(config).toHaveProperty('Name')
        expect(config).toHaveProperty('NodeToken')
        expect(config).toHaveProperty('PanTiltLimits')
        expect(config.PanTiltLimits).toHaveProperty('Range')
        expect(config.PanTiltLimits.Range).toHaveProperty('URI')
        expect(config.PanTiltLimits.Range).toHaveProperty('XRange')
        expect(config.PanTiltLimits.Range.XRange).toHaveProperty('Max')
        expect(config.PanTiltLimits.Range.XRange).toHaveProperty('Min')
        expect(config.PanTiltLimits.Range).toHaveProperty('YRange')
        expect(config.PanTiltLimits.Range.YRange).toHaveProperty('Max')
        expect(config.PanTiltLimits.Range.YRange).toHaveProperty('Min')
        expect(config).toHaveProperty('UseCount')
        expect(config).toHaveProperty('ZoomLimits')
        expect(config.ZoomLimits).toHaveProperty('Range')
        expect(config.ZoomLimits.Range).toHaveProperty('URI')
        expect(config.ZoomLimits.Range).toHaveProperty('XRange')
        expect(config.ZoomLimits.Range.XRange).toHaveProperty('Max')
        expect(config.ZoomLimits.Range.XRange).toHaveProperty('Min')
      }
      done()
    })
  })

  test('Camera.ptz.getConfiguration (Promise)', () => {
    return Camera.ptz.getConfiguration(configurationToken)
      .then(results => {
        const response = results.data.GetConfigurationResponse
        expect(response).toHaveProperty('PTZConfiguration')
        const config = response.PTZConfiguration
        expect(config).toHaveProperty('$')
        expect(config.$).toHaveProperty('token')
        configurationToken = config.$.token
        if (TestConfig.cameraType === 'hikvision' || TestConfig.cameraType === 'hikvision-fixed') {
          // found a hikvision error - shame on them
          expect(config).toHaveProperty('DefaultAbsolutePantTiltPositionSpace')
        }
        else {
          expect(config).toHaveProperty('DefaultAbsolutePanTiltPositionSpace')
        }
        expect(config).toHaveProperty('DefaultAbsoluteZoomPositionSpace')
        expect(config).toHaveProperty('DefaultContinuousPanTiltVelocitySpace')
        expect(config).toHaveProperty('DefaultContinuousZoomVelocitySpace')
        expect(config).toHaveProperty('DefaultPTZSpeed')
        const speed = config.DefaultPTZSpeed
        expect(speed).toHaveProperty('PanTilt')
        expect(speed.PanTilt).toHaveProperty('$')
        expect(speed.PanTilt.$).toHaveProperty('space')
        expect(speed.PanTilt.$).toHaveProperty('x')
        expect(speed.PanTilt.$).toHaveProperty('y')
        expect(speed).toHaveProperty('Zoom')
        expect(speed.Zoom).toHaveProperty('$')
        expect(speed.Zoom.$).toHaveProperty('space')
        expect(speed.Zoom.$).toHaveProperty('x')
        expect(config).toHaveProperty('DefaultPTZTimeout')
        expect(config).toHaveProperty('DefaultRelativePanTiltTranslationSpace')
        expect(config).toHaveProperty('DefaultRelativeZoomTranslationSpace')
        expect(config).toHaveProperty('Name')
        expect(config).toHaveProperty('NodeToken')
        expect(config).toHaveProperty('PanTiltLimits')
        expect(config.PanTiltLimits).toHaveProperty('Range')
        expect(config.PanTiltLimits.Range).toHaveProperty('URI')
        expect(config.PanTiltLimits.Range).toHaveProperty('XRange')
        expect(config.PanTiltLimits.Range.XRange).toHaveProperty('Max')
        expect(config.PanTiltLimits.Range.XRange).toHaveProperty('Min')
        expect(config.PanTiltLimits.Range).toHaveProperty('YRange')
        expect(config.PanTiltLimits.Range.YRange).toHaveProperty('Max')
        expect(config.PanTiltLimits.Range.YRange).toHaveProperty('Min')
        expect(config).toHaveProperty('UseCount')
        expect(config).toHaveProperty('ZoomLimits')
        expect(config.ZoomLimits).toHaveProperty('Range')
        expect(config.ZoomLimits.Range).toHaveProperty('URI')
        expect(config.ZoomLimits.Range).toHaveProperty('XRange')
        expect(config.ZoomLimits.Range.XRange).toHaveProperty('Max')
        expect(config.ZoomLimits.Range.XRange).toHaveProperty('Min')
      })
  })

  test('Camera.ptz.getConfiguration (Callback)', (done) => {
    return Camera.ptz.getConfiguration(configurationToken, (error, results) => {
      if (!error) {
        const response = results.data.GetConfigurationResponse
        expect(response).toHaveProperty('PTZConfiguration')
        const config = response.PTZConfiguration
        expect(config).toHaveProperty('$')
        expect(config.$).toHaveProperty('token')
        configurationToken = config.$.token
        if (TestConfig.cameraType === 'hikvision' || TestConfig.cameraType === 'hikvision-fixed') {
          // found a hikvision error - shame on them
          expect(config).toHaveProperty('DefaultAbsolutePantTiltPositionSpace')
        }
        else {
          expect(config).toHaveProperty('DefaultAbsolutePanTiltPositionSpace')
        }
        expect(config).toHaveProperty('DefaultAbsoluteZoomPositionSpace')
        expect(config).toHaveProperty('DefaultContinuousPanTiltVelocitySpace')
        expect(config).toHaveProperty('DefaultContinuousZoomVelocitySpace')
        expect(config).toHaveProperty('DefaultPTZSpeed')
        const speed = config.DefaultPTZSpeed
        expect(speed).toHaveProperty('PanTilt')
        expect(speed.PanTilt).toHaveProperty('$')
        expect(speed.PanTilt.$).toHaveProperty('space')
        expect(speed.PanTilt.$).toHaveProperty('x')
        expect(speed.PanTilt.$).toHaveProperty('y')
        expect(speed).toHaveProperty('Zoom')
        expect(speed.Zoom).toHaveProperty('$')
        expect(speed.Zoom.$).toHaveProperty('space')
        expect(speed.Zoom.$).toHaveProperty('x')
        expect(config).toHaveProperty('DefaultPTZTimeout')
        expect(config).toHaveProperty('DefaultRelativePanTiltTranslationSpace')
        expect(config).toHaveProperty('DefaultRelativeZoomTranslationSpace')
        expect(config).toHaveProperty('Name')
        expect(config).toHaveProperty('NodeToken')
        expect(config).toHaveProperty('PanTiltLimits')
        expect(config.PanTiltLimits).toHaveProperty('Range')
        expect(config.PanTiltLimits.Range).toHaveProperty('URI')
        expect(config.PanTiltLimits.Range).toHaveProperty('XRange')
        expect(config.PanTiltLimits.Range.XRange).toHaveProperty('Max')
        expect(config.PanTiltLimits.Range.XRange).toHaveProperty('Min')
        expect(config.PanTiltLimits.Range).toHaveProperty('YRange')
        expect(config.PanTiltLimits.Range.YRange).toHaveProperty('Max')
        expect(config.PanTiltLimits.Range.YRange).toHaveProperty('Min')
        expect(config).toHaveProperty('UseCount')
        expect(config).toHaveProperty('ZoomLimits')
        expect(config.ZoomLimits).toHaveProperty('Range')
        expect(config.ZoomLimits.Range).toHaveProperty('URI')
        expect(config.ZoomLimits.Range).toHaveProperty('XRange')
        expect(config.ZoomLimits.Range.XRange).toHaveProperty('Max')
        expect(config.ZoomLimits.Range.XRange).toHaveProperty('Min')
      }
      done()
    })
  })

  test('Camera.ptz.getConfigurationOptions (Promise)', () => {
    return Camera.ptz.getConfigurationOptions(configurationToken)
      .then(results => {
        const response = results.data.GetConfigurationOptionsResponse
        expect(response).toHaveProperty('PTZConfigurationOptions')
        const option = response.PTZConfigurationOptions
        expect(option).toHaveProperty('PTZTimeout')
        expect(option.PTZTimeout).toHaveProperty('Max')
        expect(option.PTZTimeout).toHaveProperty('Min')
        expect(option).toHaveProperty('Spaces')
        expect(option.Spaces).toHaveProperty('AbsolutePanTiltPositionSpace')
        expect(option.Spaces).toHaveProperty('AbsoluteZoomPositionSpace')
        expect(option.Spaces).toHaveProperty('ContinuousPanTiltVelocitySpace')
        expect(option.Spaces).toHaveProperty('ContinuousZoomVelocitySpace')
        expect(option.Spaces).toHaveProperty('PanTiltSpeedSpace')
        expect(option.Spaces).toHaveProperty('RelativePanTiltTranslationSpace')
        expect(option.Spaces).toHaveProperty('RelativeZoomTranslationSpace')
        expect(option.Spaces).toHaveProperty('ZoomSpeedSpace')
      })
  })

  test('Camera.ptz.getConfigurationOptions (Callback)', (done) => {
    Camera.ptz.getConfigurationOptions(configurationToken, (error, results) => {
      if (!error) {
        const response = results.data.GetConfigurationOptionsResponse
        expect(response).toHaveProperty('PTZConfigurationOptions')
        const option = response.PTZConfigurationOptions
        expect(option).toHaveProperty('PTZTimeout')
        expect(option.PTZTimeout).toHaveProperty('Max')
        expect(option.PTZTimeout).toHaveProperty('Min')
        expect(option).toHaveProperty('Spaces')
        expect(option.Spaces).toHaveProperty('AbsolutePanTiltPositionSpace')
        expect(option.Spaces).toHaveProperty('AbsoluteZoomPositionSpace')
        expect(option.Spaces).toHaveProperty('ContinuousPanTiltVelocitySpace')
        expect(option.Spaces).toHaveProperty('ContinuousZoomVelocitySpace')
        expect(option.Spaces).toHaveProperty('PanTiltSpeedSpace')
        expect(option.Spaces).toHaveProperty('RelativePanTiltTranslationSpace')
        expect(option.Spaces).toHaveProperty('RelativeZoomTranslationSpace')
        expect(option.Spaces).toHaveProperty('ZoomSpeedSpace')
      }
      done()
    })
  })

  // test('Camera.ptz.getCompatibleConfigurations (Promise)', () => {
  //   return Camera.ptz.getCompatibleConfigurations()
  //     .then(results => {
  //       let response = results.data.GetCompatibleConfigurationsResponse
  //     })
  //   })

  test('Camera.ptz.absoluteMove (Promise)', () => {
    const position = {
      x: 1,
      y: 0,
      z: 0
    }
    return Camera.ptz.absoluteMove(null, position)
      .then(results => {
        const response = results.data.AbsoluteMoveResponse
        expect(response).toMatch('')
      })
  })

  test('Camera.ptz.absoluteMove (Callback)', (done) => {
    const position = {
      x: 1,
      y: 0,
      z: 0
    }
    Camera.ptz.absoluteMove(null, position, null, (error, results) => {
      if (!error) {
        const response = results.data.AbsoluteMoveResponse
        expect(response).toMatch('')
      }
      done()
    })
  })

  test('Camera.ptz.relativeMove (Promise)', () => {
    const translation = {
      x: 1,
      y: 0,
      z: 0
    }
    return Camera.ptz.relativeMove(null, translation)
      .then(results => {
        const response = results.data.RelativeMoveResponse
        expect(response).toMatch('')
      })
  })

  test('Camera.ptz.relativeMove (Callback)', (done) => {
    const translation = {
      x: 1,
      y: 0,
      z: 0
    }
    Camera.ptz.relativeMove(null, translation, null, (error, results) => {
      if (!error) {
        const response = results.data.RelativeMoveResponse
        expect(response).toMatch('')
      }
      done()
    })
  })

  test('Camera.ptz.continuousMove (Promise)', () => {
    const translation = {
      x: 1,
      y: 0,
      z: 0
    }
    return Camera.ptz.continuousMove(null, translation)
      .then(results => {
        const response = results.data.ContinuousMoveResponse
        expect(response).toMatch('')
      })
  })

  test('Camera.ptz.continuousMove (Callback)', (done) => {
    const translation = {
      x: 1,
      y: 0,
      z: 0
    }
    Camera.ptz.continuousMove(null, translation, null, (error, results) => {
      if (!error) {
        const response = results.data.ContinuousMoveResponse
        expect(response).toMatch('')
      }
      done()
    })
  })

  test('Camera.ptz.stop (Promise)', () => {
    return Camera.ptz.stop(null, true, true)
      .then(results => {
        const response = results.data.StopResponse
        expect(response).toMatch('')
      })
  })

  test('Camera.ptz.stop (Callback)', (done) => {
    Camera.ptz.stop(null, true, true, (error, results) => {
      if (!error) {
        const response = results.data.StopResponse
        expect(response).toMatch('')
      }
      done()
    })
  })

  test('Camera.ptz.getStatus (Promise)', () => {
    return Camera.ptz.getStatus(null)
      .then(results => {
        const response = results.data.GetStatusResponse
        expect(response).toHaveProperty('PTZStatus')
        const status = response.PTZStatus
        expect(status).toHaveProperty('Error')
        expect(status).toHaveProperty('Position')
        expect(status.Position).toHaveProperty('PanTilt')
        expect(status.Position.PanTilt).toHaveProperty('$')
        expect(status.Position.PanTilt.$).toHaveProperty('space')
        expect(status.Position.PanTilt.$).toHaveProperty('x')
        expect(status.Position.PanTilt.$).toHaveProperty('y')
        expect(status.Position).toHaveProperty('Zoom')
        expect(status.Position.Zoom).toHaveProperty('$')
        expect(status.Position.Zoom.$).toHaveProperty('space')
        expect(status.Position.Zoom.$).toHaveProperty('x')
        expect(status).toHaveProperty('UtcTime')
      })
  })

  test('Camera.ptz.getStatus (Callback)', (done) => {
    Camera.ptz.getStatus(null, (error, results) => {
      if (!error) {
        const response = results.data.GetStatusResponse
        expect(response).toHaveProperty('PTZStatus')
        const status = response.PTZStatus
        expect(status).toHaveProperty('Error')
        expect(status).toHaveProperty('Position')
        expect(status.Position).toHaveProperty('PanTilt')
        expect(status.Position.PanTilt).toHaveProperty('$')
        expect(status.Position.PanTilt.$).toHaveProperty('space')
        expect(status.Position.PanTilt.$).toHaveProperty('x')
        expect(status.Position.PanTilt.$).toHaveProperty('y')
        expect(status.Position).toHaveProperty('Zoom')
        expect(status.Position.Zoom).toHaveProperty('$')
        expect(status.Position.Zoom.$).toHaveProperty('space')
        expect(status.Position.Zoom.$).toHaveProperty('x')
        expect(status).toHaveProperty('UtcTime')
      }
      done()
    })
  })

  test('Camera.ptz.getPresets (Promise)', () => {
    return Camera.ptz.getPresets(null)
      .then(results => {
        const response = results.data.GetPresetsResponse
        expect(response).toHaveProperty('Preset')
        const presets = response.Preset
        expect(Array.isArray(presets)).toBeTruthy()
        if (presets.length > 0) {
          const preset = presets[0]
          expect(preset).toHaveProperty('$')
          expect(preset.$).toHaveProperty('token')
          expect(preset).toHaveProperty('Name')
          presetToken = preset.$.token
        }
      })
  })

  test('Camera.ptz.getPresets (Callback)', (done) => {
    Camera.ptz.getPresets(null, (error, results) => {
      if (!error) {
        const response = results.data.GetPresetsResponse
        expect(response).toHaveProperty('Preset')
        const presets = response.Preset
        expect(Array.isArray(presets)).toBeTruthy()
        if (presets.length > 0) {
          const preset = presets[0]
          expect(preset).toHaveProperty('$')
          expect(preset.$).toHaveProperty('token')
          expect(preset).toHaveProperty('Name')
          presetToken = preset.$.token
        }
      }
      done()
    })
  })

  test('Camera.ptz.gotoPreset (Promise)', () => {
    return Camera.ptz.gotoPreset(null, presetToken)
      .then(results => {
        const response = results.data.GotoPresetResponse
        expect(response).toMatch('')
      })
  })

  test('Camera.ptz.gotoPreset (Callback)', (done) => {
    Camera.ptz.gotoPreset(null, presetToken, null, (error, results) => {
      if (!error) {
        const response = results.data.GotoPresetResponse
        expect(response).toMatch('')
      }
      done()
    })
  })

  test('Camera.ptz.gotoHomePosition (Promise)', () => {
    return Camera.ptz.gotoHomePosition(null)
      .then(results => {
        const response = results.data.GotoHomePositionResponse
        expect(response).toMatch('')
      })
  })

  test('Camera.ptz.gotoHomePosition (Callback)', (done) => {
    Camera.ptz.gotoHomePosition(null, null, (error, results) => {
      if (!error) {
        const response = results.data.GotoHomePositionResponse
        expect(response).toMatch('')
      }
      done()
    })
  })

  test('Camera.ptz.setHomePosition (Promise)', () => {
    return Camera.ptz.setHomePosition(null)
      .then(results => {
        const response = results.data.SetHomePositionResponse
        expect(response).toMatch('')
      })
  })

  test('Camera.ptz.setHomePosition (Callback)', (done) => {
    Camera.ptz.setHomePosition(null, (error, results) => {
      if (!error) {
        const response = results.data.SetHomePositionResponse
        expect(response).toMatch('')
      }
      done()
    })
  })

  test('Camera.ptz.setPreset (Promise)', () => {
    return Camera.ptz.setPreset(null, null, 'ptzPresetTest')
      .then(results => {
        const response = results.data.SetPresetResponse
        expect(response).toHaveProperty('PresetToken')
        presetToken = response.PresetToken
      })
  })

  test('Camera.ptz.removePreset (Promise)', () => {
    return Camera.ptz.removePreset(null, presetToken)
      .then(results => {
        const response = results.data.RemovePresetResponse
        expect(response).toMatch('')
      })
  })

  test('Camera.ptz.setPreset (Callback)', (done) => {
    return Camera.ptz.setPreset(null, null, 'ptzPresetTest', (error, results) => {
      if (!error) {
        const response = results.data.SetPresetResponse
        expect(response).toHaveProperty('PresetToken')
        presetToken = response.PresetToken
      }
      done()
    })
  })

  test('Camera.ptz.removePreset (Callback)', (done) => {
    Camera.ptz.removePreset(null, presetToken, (error, results) => {
      if (!error) {
        const response = results.data.RemovePresetResponse
        expect(response).toMatch('')
      }
      done()
    })
  })
})
