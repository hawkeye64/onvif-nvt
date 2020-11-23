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
let configurationToken = null

beforeEach(() => {
  const OnvifManager = require('../lib/onvif-nvt')
  Config.setDebugData(TestConfig.cameraType)
  return OnvifManager.connect(TestConfig.address, TestConfig.port, TestConfig.user, TestConfig.pass)
    .then(results => {
      Camera = results

      Camera.profileList.forEach(profile => {
        if (!configurationToken) {
          if ('VideoAnalyticsConfiguration' in profile) {
            const config = profile.VideoAnalyticsConfiguration
            configurationToken = config.$.token
          }
        }
      })
    })
})

describe('Analytics', () => {
  test('Camera.analytics', () => {
    expect(Camera.analytics).not.toBeNull()
    expect(Camera.address).toMatch(TestConfig.address)
    expect(Camera.analytics.serviceAddress.host).toMatch(TestConfig.address)
    expect(Camera.analytics.username).toMatch(TestConfig.user)
    expect(Camera.analytics.password).toMatch(TestConfig.pass)
  })

  test('Camera.analytics.buildRequest - no methodName', () => {
    return Camera.analytics.buildRequest()
      .catch(error => {
        expect(error.message).toContain('The "methodName" argument for buildRequest is required.')
      })
  })

  test('Camera.analytics.buildRequest - invalid methodName', () => {
    return Camera.analytics.buildRequest(true)
      .catch(error => {
        expect(error.message).toContain('The "methodName" argument for buildRequest is invalid:')
      })
  })

  test('Camera.analytics.getServiceCapabilities (Promise)', () => {
    return Camera.analytics.getServiceCapabilities()
      .then(results => {
        const response = results.data.GetServiceCapabilitiesResponse
        expect(response).toHaveProperty('Capabilities')
        expect(response.Capabilities).toHaveProperty('$')
        expect(response.Capabilities.$).toHaveProperty('AnalyticsModuleSupport')
        expect(response.Capabilities.$).toHaveProperty('CellBasedSceneDescriptionSupported')
        expect(response.Capabilities.$).toHaveProperty('RuleSupport')
      })
  })

  test('Camera.analytics.getServiceCapabilities (Callback)', (done) => {
    Camera.analytics.getServiceCapabilities((error, results) => {
      if (!error) {
        const response = results.data.GetServiceCapabilitiesResponse
        expect(response).toHaveProperty('Capabilities')
        expect(response.Capabilities).toHaveProperty('$')
        expect(response.Capabilities.$).toHaveProperty('AnalyticsModuleSupport')
        expect(response.Capabilities.$).toHaveProperty('CellBasedSceneDescriptionSupported')
        expect(response.Capabilities.$).toHaveProperty('RuleSupport')
      }
      done()
    })
  })

  test('Camera.analytics.getServiceCapabilities (Promise|Invalid Callback)', () => {
    return Camera.analytics.getServiceCapabilities('callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.analytics.getSupportedAnalyticsModules (Promise)', () => {
    return Camera.analytics.getSupportedAnalyticsModules(configurationToken)
      .then(results => {
        const response = results.data.GetSupportedAnalyticsModulesResponse
        expect(response).toHaveProperty('SupportedAnalyticsModules')
        expect(response.SupportedAnalyticsModules).toHaveProperty('AnalyticsModuleContentSchemaLocation')
        expect(response.SupportedAnalyticsModules).toHaveProperty('AnalyticsModuleDescription')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription).toBeArray()
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0]).toHaveProperty('$')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].$).toHaveProperty('Name')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0]).toHaveProperty('Messages')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages).toHaveProperty('$')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.$).toHaveProperty('IsProperty')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages).toHaveProperty('Data')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.Data).toHaveProperty('SimpleItemDescription')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.Data.SimpleItemDescription).toHaveProperty('$')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.Data.SimpleItemDescription.$).toHaveProperty('Name')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.Data.SimpleItemDescription.$).toHaveProperty('Type')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages).toHaveProperty('ParentTopic')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages).toHaveProperty('Source')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.Source).toHaveProperty('SimpleItemDescription')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.Source.SimpleItemDescription).toBeArray()
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.Source.SimpleItemDescription[0]).toHaveProperty('$')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.Source.SimpleItemDescription[0].$).toHaveProperty('Name')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.Source.SimpleItemDescription[0].$).toHaveProperty('Type')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0]).toHaveProperty('Parameters')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Parameters).toHaveProperty('ElementItemDescription')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Parameters.ElementItemDescription).toHaveProperty('$')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Parameters.ElementItemDescription.$).toHaveProperty('Name')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Parameters.ElementItemDescription.$).toHaveProperty('Type')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Parameters).toHaveProperty('SimpleItemDescription')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Parameters.SimpleItemDescription).toHaveProperty('$')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Parameters.SimpleItemDescription.$).toHaveProperty('Name')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Parameters.SimpleItemDescription.$).toHaveProperty('Type')
      })
  })

  test('Camera.analytics.getSupportedAnalyticsModules (Callback)', (done) => {
    Camera.analytics.getSupportedAnalyticsModules(configurationToken, (error, results) => {
      if (!error) {
        const response = results.data.GetSupportedAnalyticsModulesResponse
        expect(response).toHaveProperty('SupportedAnalyticsModules')
        expect(response.SupportedAnalyticsModules).toHaveProperty('AnalyticsModuleContentSchemaLocation')
        expect(response.SupportedAnalyticsModules).toHaveProperty('AnalyticsModuleDescription')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription).toBeArray()
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0]).toHaveProperty('$')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].$).toHaveProperty('Name')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0]).toHaveProperty('Messages')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages).toHaveProperty('$')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.$).toHaveProperty('IsProperty')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages).toHaveProperty('Data')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.Data).toHaveProperty('SimpleItemDescription')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.Data.SimpleItemDescription).toHaveProperty('$')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.Data.SimpleItemDescription.$).toHaveProperty('Name')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.Data.SimpleItemDescription.$).toHaveProperty('Type')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages).toHaveProperty('ParentTopic')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages).toHaveProperty('Source')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.Source).toHaveProperty('SimpleItemDescription')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.Source.SimpleItemDescription).toBeArray()
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.Source.SimpleItemDescription[0]).toHaveProperty('$')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.Source.SimpleItemDescription[0].$).toHaveProperty('Name')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Messages.Source.SimpleItemDescription[0].$).toHaveProperty('Type')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0]).toHaveProperty('Parameters')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Parameters).toHaveProperty('ElementItemDescription')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Parameters.ElementItemDescription).toHaveProperty('$')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Parameters.ElementItemDescription.$).toHaveProperty('Name')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Parameters.ElementItemDescription.$).toHaveProperty('Type')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Parameters).toHaveProperty('SimpleItemDescription')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Parameters.SimpleItemDescription).toHaveProperty('$')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Parameters.SimpleItemDescription.$).toHaveProperty('Name')
        expect(response.SupportedAnalyticsModules.AnalyticsModuleDescription[0].Parameters.SimpleItemDescription.$).toHaveProperty('Type')
      }
      done()
    })
  })

  test('Camera.analytics.getSupportedAnalyticsModules (Promise|Invalid Callback)', () => {
    return Camera.analytics.getSupportedAnalyticsModules(configurationToken, 'callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.analytics.getSupportedAnalyticsModules (Promise|Invalid configurationToken)', () => {
    return Camera.analytics.getSupportedAnalyticsModules(2)
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "string".')
      })
  })

  test('Camera.analytics.getAnalyticsModules (Promise)', () => {
    return Camera.analytics.getAnalyticsModules(configurationToken)
      .then(results => {
        const response = results.data.GetAnalyticsModulesResponse
        expect(response).toHaveProperty('AnalyticsModule')
        expect(response.AnalyticsModule).toBeArray()
        expect(response.AnalyticsModule[0]).toHaveProperty('$')
        expect(response.AnalyticsModule[0].$).toHaveProperty('Name')
        expect(response.AnalyticsModule[0].$).toHaveProperty('Type')
        expect(response.AnalyticsModule[0]).toHaveProperty('Parameters')
        expect(response.AnalyticsModule[0].Parameters).toHaveProperty('ElementItem')
        expect(response.AnalyticsModule[0].Parameters.ElementItem).toHaveProperty('$')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.$).toHaveProperty('Name')
        expect(response.AnalyticsModule[0].Parameters.ElementItem).toHaveProperty('CellLayout')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout).toHaveProperty('$')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.$).toHaveProperty('Columns')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.$).toHaveProperty('Rows')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout).toHaveProperty('Transformation')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.Transformation).toHaveProperty('Scale')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.Transformation.Scale).toHaveProperty('$')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.Transformation.Scale.$).toHaveProperty('x')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.Transformation.Scale.$).toHaveProperty('y')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.Transformation).toHaveProperty('Translate')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.Transformation.Translate).toHaveProperty('$')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.Transformation.Translate.$).toHaveProperty('x')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.Transformation.Translate.$).toHaveProperty('y')
        expect(response.AnalyticsModule[0].Parameters).toHaveProperty('SimpleItem')
        expect(response.AnalyticsModule[0].Parameters.SimpleItem).toHaveProperty('$')
        expect(response.AnalyticsModule[0].Parameters.SimpleItem.$).toHaveProperty('Name')
        expect(response.AnalyticsModule[0].Parameters.SimpleItem.$).toHaveProperty('Value')
      })
  })

  test('Camera.analytics.getAnalyticsModules (Callback)', (done) => {
    Camera.analytics.getAnalyticsModules(configurationToken, (error, results) => {
      if (!error) {
        const response = results.data.GetAnalyticsModulesResponse
        expect(response).toHaveProperty('AnalyticsModule')
        expect(response.AnalyticsModule).toBeArray()
        expect(response.AnalyticsModule[0]).toHaveProperty('$')
        expect(response.AnalyticsModule[0].$).toHaveProperty('Name')
        expect(response.AnalyticsModule[0].$).toHaveProperty('Type')
        expect(response.AnalyticsModule[0]).toHaveProperty('Parameters')
        expect(response.AnalyticsModule[0].Parameters).toHaveProperty('ElementItem')
        expect(response.AnalyticsModule[0].Parameters.ElementItem).toHaveProperty('$')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.$).toHaveProperty('Name')
        expect(response.AnalyticsModule[0].Parameters.ElementItem).toHaveProperty('CellLayout')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout).toHaveProperty('$')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.$).toHaveProperty('Columns')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.$).toHaveProperty('Rows')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout).toHaveProperty('Transformation')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.Transformation).toHaveProperty('Scale')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.Transformation.Scale).toHaveProperty('$')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.Transformation.Scale.$).toHaveProperty('x')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.Transformation.Scale.$).toHaveProperty('y')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.Transformation).toHaveProperty('Translate')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.Transformation.Translate).toHaveProperty('$')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.Transformation.Translate.$).toHaveProperty('x')
        expect(response.AnalyticsModule[0].Parameters.ElementItem.CellLayout.Transformation.Translate.$).toHaveProperty('y')
        expect(response.AnalyticsModule[0].Parameters).toHaveProperty('SimpleItem')
        expect(response.AnalyticsModule[0].Parameters.SimpleItem).toHaveProperty('$')
        expect(response.AnalyticsModule[0].Parameters.SimpleItem.$).toHaveProperty('Name')
        expect(response.AnalyticsModule[0].Parameters.SimpleItem.$).toHaveProperty('Value')
      }
      done()
    })
  })

  test('Camera.analytics.getAnalyticsModules (Promise|Invalid Callback)', () => {
    return Camera.analytics.getAnalyticsModules(configurationToken, 'callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.analytics.getAnalyticsModules (Promise|Invalid configurationToken)', () => {
    return Camera.analytics.getAnalyticsModules(2)
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "string".')
      })
  })

  test('Camera.analytics.getSupportedRules (Promise)', () => {
    return Camera.analytics.getSupportedRules(configurationToken)
      .then(results => {
        const response = results.data.GetSupportedRulesResponse
        expect(response).toHaveProperty('SupportedRules')
        expect(response.SupportedRules).toHaveProperty('RuleContentSchemaLocation')
        expect(response.SupportedRules).toHaveProperty('RuleDescription')
        expect(response.SupportedRules.RuleDescription).toBeArray()
        expect(response.SupportedRules.RuleDescription[0]).toHaveProperty('$')
        expect(response.SupportedRules.RuleDescription[0].$).toHaveProperty('Name')
        expect(response.SupportedRules.RuleDescription[0]).toHaveProperty('Messages')
        expect(response.SupportedRules.RuleDescription[0].Messages).toHaveProperty('$')
        expect(response.SupportedRules.RuleDescription[0].Messages).toHaveProperty('Data')
        expect(response.SupportedRules.RuleDescription[0].Messages.Data).toHaveProperty('SimpleItemDescription')
        expect(response.SupportedRules.RuleDescription[0].Messages.Data.SimpleItemDescription).toHaveProperty('$')
        expect(response.SupportedRules.RuleDescription[0].Messages.Data.SimpleItemDescription.$).toHaveProperty('Name')
        expect(response.SupportedRules.RuleDescription[0].Messages.Data.SimpleItemDescription.$).toHaveProperty('Type')
        expect(response.SupportedRules.RuleDescription[0].Messages).toHaveProperty('ParentTopic')
        expect(response.SupportedRules.RuleDescription[0].Messages).toHaveProperty('Source')
        expect(response.SupportedRules.RuleDescription[0].Messages.Source).toHaveProperty('SimpleItemDescription')
        expect(response.SupportedRules.RuleDescription[0].Messages.Source.SimpleItemDescription).toBeArray()
        expect(response.SupportedRules.RuleDescription[0].Messages.Source.SimpleItemDescription[0]).toHaveProperty('$')
        expect(response.SupportedRules.RuleDescription[0].Messages.Source.SimpleItemDescription[0].$).toHaveProperty('Name')
        expect(response.SupportedRules.RuleDescription[0].Messages.Source.SimpleItemDescription[0].$).toHaveProperty('Type')
        expect(response.SupportedRules.RuleDescription[0]).toHaveProperty('Parameters')
        expect(response.SupportedRules.RuleDescription[0].Parameters).toHaveProperty('SimpleItemDescription')
        expect(response.SupportedRules.RuleDescription[0].Parameters.SimpleItemDescription).toBeArray()
        expect(response.SupportedRules.RuleDescription[0].Parameters.SimpleItemDescription[0]).toHaveProperty('$')
        expect(response.SupportedRules.RuleDescription[0].Parameters.SimpleItemDescription[0].$).toHaveProperty('Name')
        expect(response.SupportedRules.RuleDescription[0].Parameters.SimpleItemDescription[0].$).toHaveProperty('Type')
      })
  })

  test('Camera.analytics.getSupportedRules (Callback)', (done) => {
    Camera.analytics.getSupportedRules(configurationToken, (error, results) => {
      if (!error) {
        const response = results.data.GetSupportedRulesResponse
        expect(response).toHaveProperty('SupportedRules')
        expect(response.SupportedRules).toHaveProperty('RuleContentSchemaLocation')
        expect(response.SupportedRules).toHaveProperty('RuleDescription')
        expect(response.SupportedRules.RuleDescription).toBeArray()
        expect(response.SupportedRules.RuleDescription[0]).toHaveProperty('$')
        expect(response.SupportedRules.RuleDescription[0].$).toHaveProperty('Name')
        expect(response.SupportedRules.RuleDescription[0]).toHaveProperty('Messages')
        expect(response.SupportedRules.RuleDescription[0].Messages).toHaveProperty('$')
        expect(response.SupportedRules.RuleDescription[0].Messages).toHaveProperty('Data')
        expect(response.SupportedRules.RuleDescription[0].Messages.Data).toHaveProperty('SimpleItemDescription')
        expect(response.SupportedRules.RuleDescription[0].Messages.Data.SimpleItemDescription).toHaveProperty('$')
        expect(response.SupportedRules.RuleDescription[0].Messages.Data.SimpleItemDescription.$).toHaveProperty('Name')
        expect(response.SupportedRules.RuleDescription[0].Messages.Data.SimpleItemDescription.$).toHaveProperty('Type')
        expect(response.SupportedRules.RuleDescription[0].Messages).toHaveProperty('ParentTopic')
        expect(response.SupportedRules.RuleDescription[0].Messages).toHaveProperty('Source')
        expect(response.SupportedRules.RuleDescription[0].Messages.Source).toHaveProperty('SimpleItemDescription')
        expect(response.SupportedRules.RuleDescription[0].Messages.Source.SimpleItemDescription).toBeArray()
        expect(response.SupportedRules.RuleDescription[0].Messages.Source.SimpleItemDescription[0]).toHaveProperty('$')
        expect(response.SupportedRules.RuleDescription[0].Messages.Source.SimpleItemDescription[0].$).toHaveProperty('Name')
        expect(response.SupportedRules.RuleDescription[0].Messages.Source.SimpleItemDescription[0].$).toHaveProperty('Type')
        expect(response.SupportedRules.RuleDescription[0]).toHaveProperty('Parameters')
        expect(response.SupportedRules.RuleDescription[0].Parameters).toHaveProperty('SimpleItemDescription')
        expect(response.SupportedRules.RuleDescription[0].Parameters.SimpleItemDescription).toBeArray()
        expect(response.SupportedRules.RuleDescription[0].Parameters.SimpleItemDescription[0]).toHaveProperty('$')
        expect(response.SupportedRules.RuleDescription[0].Parameters.SimpleItemDescription[0].$).toHaveProperty('Name')
        expect(response.SupportedRules.RuleDescription[0].Parameters.SimpleItemDescription[0].$).toHaveProperty('Type')
      }
      done()
    })
  })

  test('Camera.analytics.getSupportedRules (Promise|Invalid Callback)', () => {
    return Camera.analytics.getSupportedRules(configurationToken, 'callback')
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "function".')
      })
  })

  test('Camera.analytics.getSupportedRules (Promise|Invalid configurationToken)', () => {
    return Camera.analytics.getSupportedRules(2)
      .catch(error => {
        expect(error.message).toContain('The type of the value must be a "string".')
      })
  })
})
