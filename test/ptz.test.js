const Config = require('../lib/utils/config')
const TestConfig = require('./config')

// Applies to all tests in this file
var Camera = null
var nodeToken = ''
var configurationToken = ''
var presetToken = ''

beforeEach(() => {
  const OnvifManager = require('../lib/onvif-nvt')
  Config.setDebugData(TestConfig.cameraType, 'Response')
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

  test('Camera.ptz.getNodes', () => {
    return Camera.ptz.getNodes()
      .then(results => {
        let response = results.data.GetNodesResponse
        expect(response).toHaveProperty('PTZNode')
        let node = response.PTZNode
        expect(node).toHaveProperty('$')
        expect(node.$).toHaveProperty('token')
        nodeToken = node.$.token
        expect(node).toHaveProperty('AuxiliaryCommands')
        expect(node).toHaveProperty('HomeSupported')
        expect(node).toHaveProperty('MaximumNumberOfPresets')
        expect(node).toHaveProperty('Name')
        expect(node).toHaveProperty('SupportedPTZSpaces')
        let spaces = node.SupportedPTZSpaces
        expect(spaces).toHaveProperty('AbsolutePanTiltPositionSpace')
        expect(spaces).toHaveProperty('AbsoluteZoomPositionSpace')
        expect(spaces).toHaveProperty('ContinuousPanTiltVelocitySpace')
        expect(spaces).toHaveProperty('ContinuousZoomVelocitySpace')
        expect(spaces).toHaveProperty('PanTiltSpeedSpace')
        expect(spaces).toHaveProperty('RelativePanTiltTranslationSpace')
        expect(spaces).toHaveProperty('RelativeZoomTranslationSpace')
      })
  })

  test('Camera.ptz.getNode', () => {
    return Camera.ptz.getNode(nodeToken)
      .then(results => {
        let response = results.data.GetNodeResponse
        expect(response).toHaveProperty('PTZNode')
        let node = response.PTZNode
        expect(node).toHaveProperty('$')
        expect(node.$).toHaveProperty('token')
        nodeToken = node.$.token
        expect(node).toHaveProperty('AuxiliaryCommands')
        expect(node).toHaveProperty('HomeSupported')
        expect(node).toHaveProperty('MaximumNumberOfPresets')
        expect(node).toHaveProperty('Name')
        expect(node).toHaveProperty('SupportedPTZSpaces')
        let spaces = node.SupportedPTZSpaces
        expect(spaces).toHaveProperty('AbsolutePanTiltPositionSpace')
        expect(spaces).toHaveProperty('AbsoluteZoomPositionSpace')
        expect(spaces).toHaveProperty('ContinuousPanTiltVelocitySpace')
        expect(spaces).toHaveProperty('ContinuousZoomVelocitySpace')
        expect(spaces).toHaveProperty('PanTiltSpeedSpace')
        expect(spaces).toHaveProperty('RelativePanTiltTranslationSpace')
        expect(spaces).toHaveProperty('RelativeZoomTranslationSpace')
      })
  })

  test('Camera.ptz.getConfigurations', () => {
    return Camera.ptz.getConfigurations()
      .then(results => {
        let response = results.data.GetConfigurationsResponse
        expect(response).toHaveProperty('PTZConfiguration')
        let config = response.PTZConfiguration
        expect(config).toHaveProperty('$')
        expect(config.$).toHaveProperty('token')
        configurationToken = config.$.token
        if (TestConfig.cameraType === 'hikvision') {
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
        let speed = config.DefaultPTZSpeed
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

  test('Camera.ptz.getConfiguration', () => {
    return Camera.ptz.getConfiguration(configurationToken)
      .then(results => {
        let response = results.data.GetConfigurationResponse
        expect(response).toHaveProperty('PTZConfiguration')
        let config = response.PTZConfiguration
        expect(config).toHaveProperty('$')
        expect(config.$).toHaveProperty('token')
        configurationToken = config.$.token
        if (TestConfig.cameraType === 'hikvision') {
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
        let speed = config.DefaultPTZSpeed
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

  test('Camera.ptz.getConfigurationOptions', () => {
    return Camera.ptz.getConfigurationOptions(configurationToken)
      .then(results => {
        let response = results.data.GetConfigurationOptionsResponse
        expect(response).toHaveProperty('PTZConfigurationOptions')
        let option = response.PTZConfigurationOptions
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

  // test('Camera.ptz.getCompatibleConfigurations', () => {
  //   return Camera.ptz.getCompatibleConfigurations()
  //     .then(results => {
  //       let response = results.data.GetCompatibleConfigurationsResponse
  //     })
  //   })

  test('Camera.ptz.absoluteMove', () => {
    let position = {
      x: 1,
      y: 0,
      z: 0
    }
    return Camera.ptz.absoluteMove(null, position)
      .then(results => {
        let response = results.data.AbsoluteMoveResponse
        expect(response).toMatch('')
      })
  })

  test('Camera.ptz.relativeMove', () => {
    let translation = {
      x: 1,
      y: 0,
      z: 0
    }
    return Camera.ptz.relativeMove(null, translation)
      .then(results => {
        let response = results.data.RelativeMoveResponse
        expect(response).toMatch('')
      })
  })

  test('Camera.ptz.continuousMove', () => {
    let translation = {
      x: 1,
      y: 0,
      z: 0
    }
    return Camera.ptz.continuousMove(null, translation)
      .then(results => {
        let response = results.data.ContinuousMoveResponse
        expect(response).toMatch('')
      })
  })

  test('Camera.ptz.stop', () => {
    return Camera.ptz.stop(null, true, true)
      .then(results => {
        let response = results.data.StopResponse
        expect(response).toMatch('')
      })
  })

  test('Camera.ptz.getStatus', () => {
    return Camera.ptz.getStatus(null)
      .then(results => {
        let response = results.data.GetStatusResponse
        expect(response).toHaveProperty('PTZStatus')
        let status = response.PTZStatus
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

  test('Camera.ptz.getPresets', () => {
    return Camera.ptz.getPresets(null)
      .then(results => {
        let response = results.data.GetPresetsResponse
        expect(response).toHaveProperty('Preset')
        let presets = response.Preset
        expect(Array.isArray(presets)).toBeTruthy()
        if (presets.length > 0) {
          let preset = presets[0]
          expect(preset).toHaveProperty('$')
          expect(preset.$).toHaveProperty('token')
          expect(preset).toHaveProperty('Name')
          presetToken = preset.$.token
        }
      })
  })

  test('Camera.ptz.gotoPreset', () => {
    return Camera.ptz.gotoPreset(null, presetToken)
      .then(results => {
        let response = results.data.GotoPresetResponse
        expect(response).toMatch('')
      })
  })

  test('Camera.ptz.gotoHomePosition', () => {
    return Camera.ptz.gotoHomePosition(null)
      .then(results => {
        let response = results.data.GotoHomePositionResponse
        expect(response).toMatch('')
      })
  })

  test('Camera.ptz.setHomePosition', () => {
    return Camera.ptz.setHomePosition(null)
      .then(results => {
        let response = results.data.SetHomePositionResponse
        expect(response).toMatch('')
      })
  })

  test('Camera.ptz.setPreset', () => {
    return Camera.ptz.setPreset(null, null, 'homeTest')
      .then(results => {
        let response = results.data.SetPresetResponse
        expect(response).toHaveProperty('PresetToken')
        presetToken = response.PresetToken
      })
  })

  test('Camera.ptz.removePreset', () => {
    return Camera.ptz.removePreset(null, presetToken)
      .then(results => {
        let response = results.data.RemovePresetResponse
        expect(response).toMatch('')
      })
  })
})
