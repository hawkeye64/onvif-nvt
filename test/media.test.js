const Config = require('../lib/utils/config')
const TestConfig = require('./config')

let profileToken = ''

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
    let pass = Array.isArray(received)
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
var Camera = null
beforeEach(() => {
  const OnvifManager = require('../lib/onvif-nvt')
  Config.setDebugData(TestConfig.cameraType, 'media', 'Response')
  return OnvifManager.connect(TestConfig.address, TestConfig.port, TestConfig.user, TestConfig.pass)
    .then(results => {
      Camera = results
    })
})

describe('Media', () => {
  test('Camera.media', () => {
    expect(Camera.media).not.toBeNull()
    expect(Camera.address).toMatch(TestConfig.address)
    expect(Camera.media.serviceAddress.host).toMatch(TestConfig.address)
    expect(Camera.media.username).toMatch(TestConfig.user)
    expect(Camera.media.password).toMatch(TestConfig.pass)
  })

  test('Camera.media.getProfiles (Promise)', () => {
    return Camera.media.getProfiles()
      .then(results => {
        let response = results.data.GetProfilesResponse
        expect(response).toHaveProperty('Profiles')
        let profiles = response.Profiles
        expect(profiles.length).toBeTruthy()
        if (profiles.length > 0) {
          let profile = profiles[0]
          expect(profile).toHaveProperty('$')
          expect(profile.$).toHaveProperty('fixed')
          expect(profile.$).toHaveProperty('token')
          // save for other tests
          profileToken = profile['$']['token']
          expect(profile).toHaveProperty('AudioEncoderConfiguration')
          expect(profile.AudioEncoderConfiguration).toHaveProperty('$')
          expect(profile.AudioEncoderConfiguration.$).toHaveProperty('token')
          expect(profile.AudioEncoderConfiguration).toHaveProperty('Bitrate')
          expect(profile.AudioEncoderConfiguration).toHaveProperty('Encoding')
          expect(profile.AudioEncoderConfiguration).toHaveProperty('Multicast')
          expect(profile.AudioEncoderConfiguration.Multicast).toHaveProperty('Address')
          expect(profile.AudioEncoderConfiguration.Multicast.Address).toHaveProperty('IPv4Address')
          expect(profile.AudioEncoderConfiguration.Multicast.Address).toHaveProperty('Type')
          expect(profile.AudioEncoderConfiguration.Multicast).toHaveProperty('AutoStart')
          expect(profile.AudioEncoderConfiguration.Multicast).toHaveProperty('Port')
          expect(profile.AudioEncoderConfiguration.Multicast).toHaveProperty('TTL')
          expect(profile.AudioEncoderConfiguration).toHaveProperty('Name')
          expect(profile.AudioEncoderConfiguration).toHaveProperty('SampleRate')
          expect(profile.AudioEncoderConfiguration).toHaveProperty('SessionTimeout')
          expect(profile.AudioEncoderConfiguration).toHaveProperty('UseCount')
          expect(profile).toHaveProperty('AudioSourceConfiguration')
          expect(profile.AudioSourceConfiguration).toHaveProperty('$')
          expect(profile.AudioSourceConfiguration.$).toHaveProperty('token')
          expect(profile.AudioSourceConfiguration).toHaveProperty('Name')
          expect(profile.AudioSourceConfiguration).toHaveProperty('SourceToken')
          expect(profile.AudioSourceConfiguration).toHaveProperty('UseCount')
          expect(profile).toHaveProperty('Extension')
          expect(profile.Extension).toHaveProperty('AudioDecoderConfiguration')
          expect(profile.Extension.AudioDecoderConfiguration).toHaveProperty('$')
          expect(profile.Extension.AudioDecoderConfiguration.$).toHaveProperty('token')
          expect(profile.Extension.AudioDecoderConfiguration).toHaveProperty('Name')
          expect(profile.Extension.AudioDecoderConfiguration).toHaveProperty('UseCount')
          expect(profile.Extension).toHaveProperty('AudioOutputConfiguration')
          expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('$')
          expect(profile.Extension.AudioOutputConfiguration.$).toHaveProperty('token')
          expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('Name')
          expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('OutputLevel')
          expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('OutputToken')
          expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('SendPrimacy')
          expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('UseCount')
          expect(profile).toHaveProperty('PTZConfiguration')
          expect(profile.PTZConfiguration).toHaveProperty('$')
          if (TestConfig.cameraType === 'hikvision') {
            // found a hikvision error - shame on them
            expect(profile.PTZConfiguration).toHaveProperty('DefaultAbsolutePantTiltPositionSpace')
          }
          else {
            expect(profile.PTZConfiguration).toHaveProperty('DefaultAbsolutePanTiltPositionSpace')
          }
          expect(profile.PTZConfiguration).toHaveProperty('DefaultAbsoluteZoomPositionSpace')
          expect(profile.PTZConfiguration).toHaveProperty('DefaultContinuousPanTiltVelocitySpace')
          expect(profile.PTZConfiguration).toHaveProperty('DefaultContinuousZoomVelocitySpace')
          expect(profile.PTZConfiguration).toHaveProperty('DefaultPTZSpeed')
          expect(profile.PTZConfiguration.DefaultPTZSpeed).toHaveProperty('PanTilt')
          expect(profile.PTZConfiguration.DefaultPTZSpeed.PanTilt).toHaveProperty('$')
          expect(profile.PTZConfiguration.DefaultPTZSpeed.PanTilt.$).toHaveProperty('space')
          expect(profile.PTZConfiguration.DefaultPTZSpeed.PanTilt.$).toHaveProperty('x')
          expect(profile.PTZConfiguration.DefaultPTZSpeed.PanTilt.$).toHaveProperty('y')
          expect(profile.PTZConfiguration.DefaultPTZSpeed).toHaveProperty('Zoom')
          expect(profile.PTZConfiguration.DefaultPTZSpeed.Zoom).toHaveProperty('$')
          expect(profile.PTZConfiguration.DefaultPTZSpeed.Zoom.$).toHaveProperty('space')
          expect(profile.PTZConfiguration.DefaultPTZSpeed.Zoom.$).toHaveProperty('x')
          expect(profile.PTZConfiguration).toHaveProperty('DefaultPTZTimeout')
          expect(profile.PTZConfiguration).toHaveProperty('DefaultRelativePanTiltTranslationSpace')
          expect(profile.PTZConfiguration).toHaveProperty('DefaultRelativeZoomTranslationSpace')
          expect(profile.PTZConfiguration).toHaveProperty('Name')
          expect(profile.PTZConfiguration).toHaveProperty('NodeToken')
          expect(profile.PTZConfiguration).toHaveProperty('PanTiltLimits')
          expect(profile.PTZConfiguration.PanTiltLimits).toHaveProperty('Range')
          expect(profile.PTZConfiguration.PanTiltLimits.Range).toHaveProperty('URI')
          expect(profile.PTZConfiguration.PanTiltLimits.Range).toHaveProperty('XRange')
          expect(profile.PTZConfiguration.PanTiltLimits.Range.XRange).toHaveProperty('Max')
          expect(profile.PTZConfiguration.PanTiltLimits.Range.XRange).toHaveProperty('Min')
          expect(profile.PTZConfiguration.PanTiltLimits.Range).toHaveProperty('YRange')
          expect(profile.PTZConfiguration.PanTiltLimits.Range.YRange).toHaveProperty('Max')
          expect(profile.PTZConfiguration.PanTiltLimits.Range.YRange).toHaveProperty('Min')
          expect(profile.PTZConfiguration).toHaveProperty('UseCount')
          expect(profile.PTZConfiguration).toHaveProperty('ZoomLimits')
          expect(profile.PTZConfiguration.ZoomLimits).toHaveProperty('Range')
          expect(profile.PTZConfiguration.ZoomLimits.Range).toHaveProperty('URI')
          expect(profile.PTZConfiguration.ZoomLimits.Range).toHaveProperty('XRange')
          expect(profile.PTZConfiguration.ZoomLimits.Range.XRange).toHaveProperty('Max')
          expect(profile.PTZConfiguration.ZoomLimits.Range.XRange).toHaveProperty('Min')
          expect(profile).toHaveProperty('VideoAnalyticsConfiguration')
          expect(profile.VideoAnalyticsConfiguration).toHaveProperty('$')
          expect(profile.VideoAnalyticsConfiguration.$).toHaveProperty('token')
          expect(profile.VideoAnalyticsConfiguration).toHaveProperty('AnalyticsEngineConfiguration')
          expect(profile.VideoAnalyticsConfiguration.AnalyticsEngineConfiguration).toHaveProperty('AnalyticsModule')
          expect(profile.VideoAnalyticsConfiguration).toHaveProperty('Name')
          expect(profile.VideoAnalyticsConfiguration).toHaveProperty('RuleEngineConfiguration')
          expect(profile.VideoAnalyticsConfiguration.RuleEngineConfiguration).toHaveProperty('Rule')
          expect(profile.VideoAnalyticsConfiguration).toHaveProperty('UseCount')
          expect(profile).toHaveProperty('VideoEncoderConfiguration')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('$')
          expect(profile.VideoEncoderConfiguration.$).toHaveProperty('token')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('Encoding')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('H264')
          expect(profile.VideoEncoderConfiguration.H264).toHaveProperty('GovLength')
          expect(profile.VideoEncoderConfiguration.H264).toHaveProperty('H264Profile')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('Multicast')
          expect(profile.VideoEncoderConfiguration.Multicast).toHaveProperty('Address')
          expect(profile.VideoEncoderConfiguration.Multicast.Address).toHaveProperty('IPv4Address')
          expect(profile.VideoEncoderConfiguration.Multicast.Address).toHaveProperty('Type')
          expect(profile.VideoEncoderConfiguration.Multicast).toHaveProperty('AutoStart')
          expect(profile.VideoEncoderConfiguration.Multicast).toHaveProperty('Port')
          expect(profile.VideoEncoderConfiguration.Multicast).toHaveProperty('TTL')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('Name')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('Quality')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('RateControl')
          expect(profile.VideoEncoderConfiguration.RateControl).toHaveProperty('BitrateLimit')
          expect(profile.VideoEncoderConfiguration.RateControl).toHaveProperty('EncodingInterval')
          expect(profile.VideoEncoderConfiguration.RateControl).toHaveProperty('FrameRateLimit')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('Resolution')
          expect(profile.VideoEncoderConfiguration.Resolution).toHaveProperty('Height')
          expect(profile.VideoEncoderConfiguration.Resolution).toHaveProperty('Width')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('SessionTimeout')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('UseCount')
          expect(profile).toHaveProperty('VideoSourceConfiguration')
          expect(profile.VideoSourceConfiguration).toHaveProperty('$')
          expect(profile.VideoSourceConfiguration.$).toHaveProperty('token')
          expect(profile.VideoSourceConfiguration).toHaveProperty('Bounds')
          expect(profile.VideoSourceConfiguration.Bounds).toHaveProperty('$')
          expect(profile.VideoSourceConfiguration.Bounds.$).toHaveProperty('height')
          expect(profile.VideoSourceConfiguration.Bounds.$).toHaveProperty('width')
          expect(profile.VideoSourceConfiguration.Bounds.$).toHaveProperty('x')
          expect(profile.VideoSourceConfiguration.Bounds.$).toHaveProperty('y')
          expect(profile.VideoSourceConfiguration).toHaveProperty('Name')
          expect(profile.VideoSourceConfiguration).toHaveProperty('SourceToken')
          expect(profile.VideoSourceConfiguration).toHaveProperty('UseCount')
        }
      })
  })

  test('Camera.media.getProfiles (Callback)', (done) => {
    Camera.media.getProfiles((error, results) => {
      if (!error) {
        let response = results.data.GetProfilesResponse
        expect(response).toHaveProperty('Profiles')
        let profiles = response.Profiles
        expect(profiles.length).toBeTruthy()
        if (profiles.length > 0) {
          let profile = profiles[0]
          expect(profile).toHaveProperty('$')
          expect(profile.$).toHaveProperty('fixed')
          expect(profile.$).toHaveProperty('token')
          // save for other tests
          profileToken = profile['$']['token']
          expect(profile).toHaveProperty('AudioEncoderConfiguration')
          expect(profile.AudioEncoderConfiguration).toHaveProperty('$')
          expect(profile.AudioEncoderConfiguration.$).toHaveProperty('token')
          expect(profile.AudioEncoderConfiguration).toHaveProperty('Bitrate')
          expect(profile.AudioEncoderConfiguration).toHaveProperty('Encoding')
          expect(profile.AudioEncoderConfiguration).toHaveProperty('Multicast')
          expect(profile.AudioEncoderConfiguration.Multicast).toHaveProperty('Address')
          expect(profile.AudioEncoderConfiguration.Multicast.Address).toHaveProperty('IPv4Address')
          expect(profile.AudioEncoderConfiguration.Multicast.Address).toHaveProperty('Type')
          expect(profile.AudioEncoderConfiguration.Multicast).toHaveProperty('AutoStart')
          expect(profile.AudioEncoderConfiguration.Multicast).toHaveProperty('Port')
          expect(profile.AudioEncoderConfiguration.Multicast).toHaveProperty('TTL')
          expect(profile.AudioEncoderConfiguration).toHaveProperty('Name')
          expect(profile.AudioEncoderConfiguration).toHaveProperty('SampleRate')
          expect(profile.AudioEncoderConfiguration).toHaveProperty('SessionTimeout')
          expect(profile.AudioEncoderConfiguration).toHaveProperty('UseCount')
          expect(profile).toHaveProperty('AudioSourceConfiguration')
          expect(profile.AudioSourceConfiguration).toHaveProperty('$')
          expect(profile.AudioSourceConfiguration.$).toHaveProperty('token')
          expect(profile.AudioSourceConfiguration).toHaveProperty('Name')
          expect(profile.AudioSourceConfiguration).toHaveProperty('SourceToken')
          expect(profile.AudioSourceConfiguration).toHaveProperty('UseCount')
          expect(profile).toHaveProperty('Extension')
          expect(profile.Extension).toHaveProperty('AudioDecoderConfiguration')
          expect(profile.Extension.AudioDecoderConfiguration).toHaveProperty('$')
          expect(profile.Extension.AudioDecoderConfiguration.$).toHaveProperty('token')
          expect(profile.Extension.AudioDecoderConfiguration).toHaveProperty('Name')
          expect(profile.Extension.AudioDecoderConfiguration).toHaveProperty('UseCount')
          expect(profile.Extension).toHaveProperty('AudioOutputConfiguration')
          expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('$')
          expect(profile.Extension.AudioOutputConfiguration.$).toHaveProperty('token')
          expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('Name')
          expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('OutputLevel')
          expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('OutputToken')
          expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('SendPrimacy')
          expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('UseCount')
          expect(profile).toHaveProperty('PTZConfiguration')
          expect(profile.PTZConfiguration).toHaveProperty('$')
          if (TestConfig.cameraType === 'hikvision') {
          // found a hikvision error - shame on them
            expect(profile.PTZConfiguration).toHaveProperty('DefaultAbsolutePantTiltPositionSpace')
          }
          else {
            expect(profile.PTZConfiguration).toHaveProperty('DefaultAbsolutePanTiltPositionSpace')
          }
          expect(profile.PTZConfiguration).toHaveProperty('DefaultAbsoluteZoomPositionSpace')
          expect(profile.PTZConfiguration).toHaveProperty('DefaultContinuousPanTiltVelocitySpace')
          expect(profile.PTZConfiguration).toHaveProperty('DefaultContinuousZoomVelocitySpace')
          expect(profile.PTZConfiguration).toHaveProperty('DefaultPTZSpeed')
          expect(profile.PTZConfiguration.DefaultPTZSpeed).toHaveProperty('PanTilt')
          expect(profile.PTZConfiguration.DefaultPTZSpeed.PanTilt).toHaveProperty('$')
          expect(profile.PTZConfiguration.DefaultPTZSpeed.PanTilt.$).toHaveProperty('space')
          expect(profile.PTZConfiguration.DefaultPTZSpeed.PanTilt.$).toHaveProperty('x')
          expect(profile.PTZConfiguration.DefaultPTZSpeed.PanTilt.$).toHaveProperty('y')
          expect(profile.PTZConfiguration.DefaultPTZSpeed).toHaveProperty('Zoom')
          expect(profile.PTZConfiguration.DefaultPTZSpeed.Zoom).toHaveProperty('$')
          expect(profile.PTZConfiguration.DefaultPTZSpeed.Zoom.$).toHaveProperty('space')
          expect(profile.PTZConfiguration.DefaultPTZSpeed.Zoom.$).toHaveProperty('x')
          expect(profile.PTZConfiguration).toHaveProperty('DefaultPTZTimeout')
          expect(profile.PTZConfiguration).toHaveProperty('DefaultRelativePanTiltTranslationSpace')
          expect(profile.PTZConfiguration).toHaveProperty('DefaultRelativeZoomTranslationSpace')
          expect(profile.PTZConfiguration).toHaveProperty('Name')
          expect(profile.PTZConfiguration).toHaveProperty('NodeToken')
          expect(profile.PTZConfiguration).toHaveProperty('PanTiltLimits')
          expect(profile.PTZConfiguration.PanTiltLimits).toHaveProperty('Range')
          expect(profile.PTZConfiguration.PanTiltLimits.Range).toHaveProperty('URI')
          expect(profile.PTZConfiguration.PanTiltLimits.Range).toHaveProperty('XRange')
          expect(profile.PTZConfiguration.PanTiltLimits.Range.XRange).toHaveProperty('Max')
          expect(profile.PTZConfiguration.PanTiltLimits.Range.XRange).toHaveProperty('Min')
          expect(profile.PTZConfiguration.PanTiltLimits.Range).toHaveProperty('YRange')
          expect(profile.PTZConfiguration.PanTiltLimits.Range.YRange).toHaveProperty('Max')
          expect(profile.PTZConfiguration.PanTiltLimits.Range.YRange).toHaveProperty('Min')
          expect(profile.PTZConfiguration).toHaveProperty('UseCount')
          expect(profile.PTZConfiguration).toHaveProperty('ZoomLimits')
          expect(profile.PTZConfiguration.ZoomLimits).toHaveProperty('Range')
          expect(profile.PTZConfiguration.ZoomLimits.Range).toHaveProperty('URI')
          expect(profile.PTZConfiguration.ZoomLimits.Range).toHaveProperty('XRange')
          expect(profile.PTZConfiguration.ZoomLimits.Range.XRange).toHaveProperty('Max')
          expect(profile.PTZConfiguration.ZoomLimits.Range.XRange).toHaveProperty('Min')
          expect(profile).toHaveProperty('VideoAnalyticsConfiguration')
          expect(profile.VideoAnalyticsConfiguration).toHaveProperty('$')
          expect(profile.VideoAnalyticsConfiguration.$).toHaveProperty('token')
          expect(profile.VideoAnalyticsConfiguration).toHaveProperty('AnalyticsEngineConfiguration')
          expect(profile.VideoAnalyticsConfiguration.AnalyticsEngineConfiguration).toHaveProperty('AnalyticsModule')
          expect(profile.VideoAnalyticsConfiguration).toHaveProperty('Name')
          expect(profile.VideoAnalyticsConfiguration).toHaveProperty('RuleEngineConfiguration')
          expect(profile.VideoAnalyticsConfiguration.RuleEngineConfiguration).toHaveProperty('Rule')
          expect(profile.VideoAnalyticsConfiguration).toHaveProperty('UseCount')
          expect(profile).toHaveProperty('VideoEncoderConfiguration')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('$')
          expect(profile.VideoEncoderConfiguration.$).toHaveProperty('token')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('Encoding')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('H264')
          expect(profile.VideoEncoderConfiguration.H264).toHaveProperty('GovLength')
          expect(profile.VideoEncoderConfiguration.H264).toHaveProperty('H264Profile')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('Multicast')
          expect(profile.VideoEncoderConfiguration.Multicast).toHaveProperty('Address')
          expect(profile.VideoEncoderConfiguration.Multicast.Address).toHaveProperty('IPv4Address')
          expect(profile.VideoEncoderConfiguration.Multicast.Address).toHaveProperty('Type')
          expect(profile.VideoEncoderConfiguration.Multicast).toHaveProperty('AutoStart')
          expect(profile.VideoEncoderConfiguration.Multicast).toHaveProperty('Port')
          expect(profile.VideoEncoderConfiguration.Multicast).toHaveProperty('TTL')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('Name')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('Quality')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('RateControl')
          expect(profile.VideoEncoderConfiguration.RateControl).toHaveProperty('BitrateLimit')
          expect(profile.VideoEncoderConfiguration.RateControl).toHaveProperty('EncodingInterval')
          expect(profile.VideoEncoderConfiguration.RateControl).toHaveProperty('FrameRateLimit')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('Resolution')
          expect(profile.VideoEncoderConfiguration.Resolution).toHaveProperty('Height')
          expect(profile.VideoEncoderConfiguration.Resolution).toHaveProperty('Width')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('SessionTimeout')
          expect(profile.VideoEncoderConfiguration).toHaveProperty('UseCount')
          expect(profile).toHaveProperty('VideoSourceConfiguration')
          expect(profile.VideoSourceConfiguration).toHaveProperty('$')
          expect(profile.VideoSourceConfiguration.$).toHaveProperty('token')
          expect(profile.VideoSourceConfiguration).toHaveProperty('Bounds')
          expect(profile.VideoSourceConfiguration.Bounds).toHaveProperty('$')
          expect(profile.VideoSourceConfiguration.Bounds.$).toHaveProperty('height')
          expect(profile.VideoSourceConfiguration.Bounds.$).toHaveProperty('width')
          expect(profile.VideoSourceConfiguration.Bounds.$).toHaveProperty('x')
          expect(profile.VideoSourceConfiguration.Bounds.$).toHaveProperty('y')
          expect(profile.VideoSourceConfiguration).toHaveProperty('Name')
          expect(profile.VideoSourceConfiguration).toHaveProperty('SourceToken')
          expect(profile.VideoSourceConfiguration).toHaveProperty('UseCount')
        }
        done()
      }
    })
  })

  test('Camera.media.getProfile (Promise)', () => {
    return Camera.media.getProfile(profileToken)
      .then(results => {
        let response = results.data.GetProfileResponse
        expect(response).toHaveProperty('Profile')
        let profile = response.Profile
        expect(profile).toHaveProperty('$')
        expect(profile.$).toHaveProperty('fixed')
        expect(profile.$).toHaveProperty('token')
        expect(profile).toHaveProperty('AudioEncoderConfiguration')
        expect(profile.AudioEncoderConfiguration).toHaveProperty('$')
        expect(profile.AudioEncoderConfiguration.$).toHaveProperty('token')
        expect(profile.AudioEncoderConfiguration).toHaveProperty('Bitrate')
        expect(profile.AudioEncoderConfiguration).toHaveProperty('Encoding')
        expect(profile.AudioEncoderConfiguration).toHaveProperty('Multicast')
        expect(profile.AudioEncoderConfiguration.Multicast).toHaveProperty('Address')
        expect(profile.AudioEncoderConfiguration.Multicast.Address).toHaveProperty('IPv4Address')
        expect(profile.AudioEncoderConfiguration.Multicast.Address).toHaveProperty('Type')
        expect(profile.AudioEncoderConfiguration.Multicast).toHaveProperty('AutoStart')
        expect(profile.AudioEncoderConfiguration.Multicast).toHaveProperty('Port')
        expect(profile.AudioEncoderConfiguration.Multicast).toHaveProperty('TTL')
        expect(profile.AudioEncoderConfiguration).toHaveProperty('Name')
        expect(profile.AudioEncoderConfiguration).toHaveProperty('SampleRate')
        expect(profile.AudioEncoderConfiguration).toHaveProperty('SessionTimeout')
        expect(profile.AudioEncoderConfiguration).toHaveProperty('UseCount')
        expect(profile).toHaveProperty('AudioSourceConfiguration')
        expect(profile.AudioSourceConfiguration).toHaveProperty('$')
        expect(profile.AudioSourceConfiguration.$).toHaveProperty('token')
        expect(profile.AudioSourceConfiguration).toHaveProperty('Name')
        expect(profile.AudioSourceConfiguration).toHaveProperty('SourceToken')
        expect(profile.AudioSourceConfiguration).toHaveProperty('UseCount')
        expect(profile).toHaveProperty('Extension')
        expect(profile.Extension).toHaveProperty('AudioDecoderConfiguration')
        expect(profile.Extension.AudioDecoderConfiguration).toHaveProperty('$')
        expect(profile.Extension.AudioDecoderConfiguration.$).toHaveProperty('token')
        expect(profile.Extension.AudioDecoderConfiguration).toHaveProperty('Name')
        expect(profile.Extension.AudioDecoderConfiguration).toHaveProperty('UseCount')
        expect(profile.Extension).toHaveProperty('AudioOutputConfiguration')
        expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('$')
        expect(profile.Extension.AudioOutputConfiguration.$).toHaveProperty('token')
        expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('Name')
        expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('OutputLevel')
        expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('OutputToken')
        expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('SendPrimacy')
        expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('UseCount')
        expect(profile).toHaveProperty('PTZConfiguration')
        expect(profile.PTZConfiguration).toHaveProperty('$')
        if (TestConfig.cameraType === 'hikvision') {
          // found a hikvision error - shame on them
          expect(profile.PTZConfiguration).toHaveProperty('DefaultAbsolutePantTiltPositionSpace')
        }
        else {
          expect(profile.PTZConfiguration).toHaveProperty('DefaultAbsolutePanTiltPositionSpace')
        }
        expect(profile.PTZConfiguration).toHaveProperty('DefaultAbsoluteZoomPositionSpace')
        expect(profile.PTZConfiguration).toHaveProperty('DefaultContinuousPanTiltVelocitySpace')
        expect(profile.PTZConfiguration).toHaveProperty('DefaultContinuousZoomVelocitySpace')
        expect(profile.PTZConfiguration).toHaveProperty('DefaultPTZSpeed')
        expect(profile.PTZConfiguration.DefaultPTZSpeed).toHaveProperty('PanTilt')
        expect(profile.PTZConfiguration.DefaultPTZSpeed.PanTilt).toHaveProperty('$')
        expect(profile.PTZConfiguration.DefaultPTZSpeed.PanTilt.$).toHaveProperty('space')
        expect(profile.PTZConfiguration.DefaultPTZSpeed.PanTilt.$).toHaveProperty('x')
        expect(profile.PTZConfiguration.DefaultPTZSpeed.PanTilt.$).toHaveProperty('y')
        expect(profile.PTZConfiguration.DefaultPTZSpeed).toHaveProperty('Zoom')
        expect(profile.PTZConfiguration.DefaultPTZSpeed.Zoom).toHaveProperty('$')
        expect(profile.PTZConfiguration.DefaultPTZSpeed.Zoom.$).toHaveProperty('space')
        expect(profile.PTZConfiguration.DefaultPTZSpeed.Zoom.$).toHaveProperty('x')
        expect(profile.PTZConfiguration).toHaveProperty('DefaultPTZTimeout')
        expect(profile.PTZConfiguration).toHaveProperty('DefaultRelativePanTiltTranslationSpace')
        expect(profile.PTZConfiguration).toHaveProperty('DefaultRelativeZoomTranslationSpace')
        expect(profile.PTZConfiguration).toHaveProperty('Name')
        expect(profile.PTZConfiguration).toHaveProperty('NodeToken')
        expect(profile.PTZConfiguration).toHaveProperty('PanTiltLimits')
        expect(profile.PTZConfiguration.PanTiltLimits).toHaveProperty('Range')
        expect(profile.PTZConfiguration.PanTiltLimits.Range).toHaveProperty('URI')
        expect(profile.PTZConfiguration.PanTiltLimits.Range).toHaveProperty('XRange')
        expect(profile.PTZConfiguration.PanTiltLimits.Range.XRange).toHaveProperty('Max')
        expect(profile.PTZConfiguration.PanTiltLimits.Range.XRange).toHaveProperty('Min')
        expect(profile.PTZConfiguration.PanTiltLimits.Range).toHaveProperty('YRange')
        expect(profile.PTZConfiguration.PanTiltLimits.Range.YRange).toHaveProperty('Max')
        expect(profile.PTZConfiguration.PanTiltLimits.Range.YRange).toHaveProperty('Min')
        expect(profile.PTZConfiguration).toHaveProperty('UseCount')
        expect(profile.PTZConfiguration).toHaveProperty('ZoomLimits')
        expect(profile.PTZConfiguration.ZoomLimits).toHaveProperty('Range')
        expect(profile.PTZConfiguration.ZoomLimits.Range).toHaveProperty('URI')
        expect(profile.PTZConfiguration.ZoomLimits.Range).toHaveProperty('XRange')
        expect(profile.PTZConfiguration.ZoomLimits.Range.XRange).toHaveProperty('Max')
        expect(profile.PTZConfiguration.ZoomLimits.Range.XRange).toHaveProperty('Min')
        expect(profile).toHaveProperty('VideoAnalyticsConfiguration')
        expect(profile.VideoAnalyticsConfiguration).toHaveProperty('$')
        expect(profile.VideoAnalyticsConfiguration.$).toHaveProperty('token')
        expect(profile.VideoAnalyticsConfiguration).toHaveProperty('AnalyticsEngineConfiguration')
        expect(profile.VideoAnalyticsConfiguration.AnalyticsEngineConfiguration).toHaveProperty('AnalyticsModule')
        expect(profile.VideoAnalyticsConfiguration).toHaveProperty('Name')
        expect(profile.VideoAnalyticsConfiguration).toHaveProperty('RuleEngineConfiguration')
        expect(profile.VideoAnalyticsConfiguration.RuleEngineConfiguration).toHaveProperty('Rule')
        expect(profile.VideoAnalyticsConfiguration).toHaveProperty('UseCount')
        expect(profile).toHaveProperty('VideoEncoderConfiguration')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('$')
        expect(profile.VideoEncoderConfiguration.$).toHaveProperty('token')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('Encoding')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('H264')
        expect(profile.VideoEncoderConfiguration.H264).toHaveProperty('GovLength')
        expect(profile.VideoEncoderConfiguration.H264).toHaveProperty('H264Profile')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('Multicast')
        expect(profile.VideoEncoderConfiguration.Multicast).toHaveProperty('Address')
        expect(profile.VideoEncoderConfiguration.Multicast.Address).toHaveProperty('IPv4Address')
        expect(profile.VideoEncoderConfiguration.Multicast.Address).toHaveProperty('Type')
        expect(profile.VideoEncoderConfiguration.Multicast).toHaveProperty('AutoStart')
        expect(profile.VideoEncoderConfiguration.Multicast).toHaveProperty('Port')
        expect(profile.VideoEncoderConfiguration.Multicast).toHaveProperty('TTL')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('Name')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('Quality')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('RateControl')
        expect(profile.VideoEncoderConfiguration.RateControl).toHaveProperty('BitrateLimit')
        expect(profile.VideoEncoderConfiguration.RateControl).toHaveProperty('EncodingInterval')
        expect(profile.VideoEncoderConfiguration.RateControl).toHaveProperty('FrameRateLimit')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('Resolution')
        expect(profile.VideoEncoderConfiguration.Resolution).toHaveProperty('Height')
        expect(profile.VideoEncoderConfiguration.Resolution).toHaveProperty('Width')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('SessionTimeout')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('UseCount')
        expect(profile).toHaveProperty('VideoSourceConfiguration')
        expect(profile.VideoSourceConfiguration).toHaveProperty('$')
        expect(profile.VideoSourceConfiguration.$).toHaveProperty('token')
        expect(profile.VideoSourceConfiguration).toHaveProperty('Bounds')
        expect(profile.VideoSourceConfiguration.Bounds).toHaveProperty('$')
        expect(profile.VideoSourceConfiguration.Bounds.$).toHaveProperty('height')
        expect(profile.VideoSourceConfiguration.Bounds.$).toHaveProperty('width')
        expect(profile.VideoSourceConfiguration.Bounds.$).toHaveProperty('x')
        expect(profile.VideoSourceConfiguration.Bounds.$).toHaveProperty('y')
        expect(profile.VideoSourceConfiguration).toHaveProperty('Name')
        expect(profile.VideoSourceConfiguration).toHaveProperty('SourceToken')
        expect(profile.VideoSourceConfiguration).toHaveProperty('UseCount')
      })
  })

  test('Camera.media.getProfile (Callback)', (done) => {
    Camera.media.getProfile(profileToken, (error, results) => {
      if (!error) {
        let response = results.data.GetProfileResponse
        expect(response).toHaveProperty('Profile')
        let profile = response.Profile
        expect(profile).toHaveProperty('$')
        expect(profile.$).toHaveProperty('fixed')
        expect(profile.$).toHaveProperty('token')
        expect(profile).toHaveProperty('AudioEncoderConfiguration')
        expect(profile.AudioEncoderConfiguration).toHaveProperty('$')
        expect(profile.AudioEncoderConfiguration.$).toHaveProperty('token')
        expect(profile.AudioEncoderConfiguration).toHaveProperty('Bitrate')
        expect(profile.AudioEncoderConfiguration).toHaveProperty('Encoding')
        expect(profile.AudioEncoderConfiguration).toHaveProperty('Multicast')
        expect(profile.AudioEncoderConfiguration.Multicast).toHaveProperty('Address')
        expect(profile.AudioEncoderConfiguration.Multicast.Address).toHaveProperty('IPv4Address')
        expect(profile.AudioEncoderConfiguration.Multicast.Address).toHaveProperty('Type')
        expect(profile.AudioEncoderConfiguration.Multicast).toHaveProperty('AutoStart')
        expect(profile.AudioEncoderConfiguration.Multicast).toHaveProperty('Port')
        expect(profile.AudioEncoderConfiguration.Multicast).toHaveProperty('TTL')
        expect(profile.AudioEncoderConfiguration).toHaveProperty('Name')
        expect(profile.AudioEncoderConfiguration).toHaveProperty('SampleRate')
        expect(profile.AudioEncoderConfiguration).toHaveProperty('SessionTimeout')
        expect(profile.AudioEncoderConfiguration).toHaveProperty('UseCount')
        expect(profile).toHaveProperty('AudioSourceConfiguration')
        expect(profile.AudioSourceConfiguration).toHaveProperty('$')
        expect(profile.AudioSourceConfiguration.$).toHaveProperty('token')
        expect(profile.AudioSourceConfiguration).toHaveProperty('Name')
        expect(profile.AudioSourceConfiguration).toHaveProperty('SourceToken')
        expect(profile.AudioSourceConfiguration).toHaveProperty('UseCount')
        expect(profile).toHaveProperty('Extension')
        expect(profile.Extension).toHaveProperty('AudioDecoderConfiguration')
        expect(profile.Extension.AudioDecoderConfiguration).toHaveProperty('$')
        expect(profile.Extension.AudioDecoderConfiguration.$).toHaveProperty('token')
        expect(profile.Extension.AudioDecoderConfiguration).toHaveProperty('Name')
        expect(profile.Extension.AudioDecoderConfiguration).toHaveProperty('UseCount')
        expect(profile.Extension).toHaveProperty('AudioOutputConfiguration')
        expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('$')
        expect(profile.Extension.AudioOutputConfiguration.$).toHaveProperty('token')
        expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('Name')
        expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('OutputLevel')
        expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('OutputToken')
        expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('SendPrimacy')
        expect(profile.Extension.AudioOutputConfiguration).toHaveProperty('UseCount')
        expect(profile).toHaveProperty('PTZConfiguration')
        expect(profile.PTZConfiguration).toHaveProperty('$')
        if (TestConfig.cameraType === 'hikvision') {
        // found a hikvision error - shame on them
          expect(profile.PTZConfiguration).toHaveProperty('DefaultAbsolutePantTiltPositionSpace')
        }
        else {
          expect(profile.PTZConfiguration).toHaveProperty('DefaultAbsolutePanTiltPositionSpace')
        }
        expect(profile.PTZConfiguration).toHaveProperty('DefaultAbsoluteZoomPositionSpace')
        expect(profile.PTZConfiguration).toHaveProperty('DefaultContinuousPanTiltVelocitySpace')
        expect(profile.PTZConfiguration).toHaveProperty('DefaultContinuousZoomVelocitySpace')
        expect(profile.PTZConfiguration).toHaveProperty('DefaultPTZSpeed')
        expect(profile.PTZConfiguration.DefaultPTZSpeed).toHaveProperty('PanTilt')
        expect(profile.PTZConfiguration.DefaultPTZSpeed.PanTilt).toHaveProperty('$')
        expect(profile.PTZConfiguration.DefaultPTZSpeed.PanTilt.$).toHaveProperty('space')
        expect(profile.PTZConfiguration.DefaultPTZSpeed.PanTilt.$).toHaveProperty('x')
        expect(profile.PTZConfiguration.DefaultPTZSpeed.PanTilt.$).toHaveProperty('y')
        expect(profile.PTZConfiguration.DefaultPTZSpeed).toHaveProperty('Zoom')
        expect(profile.PTZConfiguration.DefaultPTZSpeed.Zoom).toHaveProperty('$')
        expect(profile.PTZConfiguration.DefaultPTZSpeed.Zoom.$).toHaveProperty('space')
        expect(profile.PTZConfiguration.DefaultPTZSpeed.Zoom.$).toHaveProperty('x')
        expect(profile.PTZConfiguration).toHaveProperty('DefaultPTZTimeout')
        expect(profile.PTZConfiguration).toHaveProperty('DefaultRelativePanTiltTranslationSpace')
        expect(profile.PTZConfiguration).toHaveProperty('DefaultRelativeZoomTranslationSpace')
        expect(profile.PTZConfiguration).toHaveProperty('Name')
        expect(profile.PTZConfiguration).toHaveProperty('NodeToken')
        expect(profile.PTZConfiguration).toHaveProperty('PanTiltLimits')
        expect(profile.PTZConfiguration.PanTiltLimits).toHaveProperty('Range')
        expect(profile.PTZConfiguration.PanTiltLimits.Range).toHaveProperty('URI')
        expect(profile.PTZConfiguration.PanTiltLimits.Range).toHaveProperty('XRange')
        expect(profile.PTZConfiguration.PanTiltLimits.Range.XRange).toHaveProperty('Max')
        expect(profile.PTZConfiguration.PanTiltLimits.Range.XRange).toHaveProperty('Min')
        expect(profile.PTZConfiguration.PanTiltLimits.Range).toHaveProperty('YRange')
        expect(profile.PTZConfiguration.PanTiltLimits.Range.YRange).toHaveProperty('Max')
        expect(profile.PTZConfiguration.PanTiltLimits.Range.YRange).toHaveProperty('Min')
        expect(profile.PTZConfiguration).toHaveProperty('UseCount')
        expect(profile.PTZConfiguration).toHaveProperty('ZoomLimits')
        expect(profile.PTZConfiguration.ZoomLimits).toHaveProperty('Range')
        expect(profile.PTZConfiguration.ZoomLimits.Range).toHaveProperty('URI')
        expect(profile.PTZConfiguration.ZoomLimits.Range).toHaveProperty('XRange')
        expect(profile.PTZConfiguration.ZoomLimits.Range.XRange).toHaveProperty('Max')
        expect(profile.PTZConfiguration.ZoomLimits.Range.XRange).toHaveProperty('Min')
        expect(profile).toHaveProperty('VideoAnalyticsConfiguration')
        expect(profile.VideoAnalyticsConfiguration).toHaveProperty('$')
        expect(profile.VideoAnalyticsConfiguration.$).toHaveProperty('token')
        expect(profile.VideoAnalyticsConfiguration).toHaveProperty('AnalyticsEngineConfiguration')
        expect(profile.VideoAnalyticsConfiguration.AnalyticsEngineConfiguration).toHaveProperty('AnalyticsModule')
        expect(profile.VideoAnalyticsConfiguration).toHaveProperty('Name')
        expect(profile.VideoAnalyticsConfiguration).toHaveProperty('RuleEngineConfiguration')
        expect(profile.VideoAnalyticsConfiguration.RuleEngineConfiguration).toHaveProperty('Rule')
        expect(profile.VideoAnalyticsConfiguration).toHaveProperty('UseCount')
        expect(profile).toHaveProperty('VideoEncoderConfiguration')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('$')
        expect(profile.VideoEncoderConfiguration.$).toHaveProperty('token')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('Encoding')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('H264')
        expect(profile.VideoEncoderConfiguration.H264).toHaveProperty('GovLength')
        expect(profile.VideoEncoderConfiguration.H264).toHaveProperty('H264Profile')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('Multicast')
        expect(profile.VideoEncoderConfiguration.Multicast).toHaveProperty('Address')
        expect(profile.VideoEncoderConfiguration.Multicast.Address).toHaveProperty('IPv4Address')
        expect(profile.VideoEncoderConfiguration.Multicast.Address).toHaveProperty('Type')
        expect(profile.VideoEncoderConfiguration.Multicast).toHaveProperty('AutoStart')
        expect(profile.VideoEncoderConfiguration.Multicast).toHaveProperty('Port')
        expect(profile.VideoEncoderConfiguration.Multicast).toHaveProperty('TTL')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('Name')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('Quality')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('RateControl')
        expect(profile.VideoEncoderConfiguration.RateControl).toHaveProperty('BitrateLimit')
        expect(profile.VideoEncoderConfiguration.RateControl).toHaveProperty('EncodingInterval')
        expect(profile.VideoEncoderConfiguration.RateControl).toHaveProperty('FrameRateLimit')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('Resolution')
        expect(profile.VideoEncoderConfiguration.Resolution).toHaveProperty('Height')
        expect(profile.VideoEncoderConfiguration.Resolution).toHaveProperty('Width')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('SessionTimeout')
        expect(profile.VideoEncoderConfiguration).toHaveProperty('UseCount')
        expect(profile).toHaveProperty('VideoSourceConfiguration')
        expect(profile.VideoSourceConfiguration).toHaveProperty('$')
        expect(profile.VideoSourceConfiguration.$).toHaveProperty('token')
        expect(profile.VideoSourceConfiguration).toHaveProperty('Bounds')
        expect(profile.VideoSourceConfiguration.Bounds).toHaveProperty('$')
        expect(profile.VideoSourceConfiguration.Bounds.$).toHaveProperty('height')
        expect(profile.VideoSourceConfiguration.Bounds.$).toHaveProperty('width')
        expect(profile.VideoSourceConfiguration.Bounds.$).toHaveProperty('x')
        expect(profile.VideoSourceConfiguration.Bounds.$).toHaveProperty('y')
        expect(profile.VideoSourceConfiguration).toHaveProperty('Name')
        expect(profile.VideoSourceConfiguration).toHaveProperty('SourceToken')
        expect(profile.VideoSourceConfiguration).toHaveProperty('UseCount')
      }
      done()
    })
  })

  test('Camera.media.getVideoSources (Promise)', () => {
    return Camera.media.getVideoSources()
      .then(results => {
        let response = results.data.GetVideoSourcesResponse
        expect(response).toHaveProperty('VideoSources')
        let videoSources = response.VideoSources
        expect(videoSources).toHaveProperty('$')
        expect(videoSources.$).toHaveProperty('token')
        expect(videoSources).toHaveProperty('Framerate')
        expect(videoSources).toHaveProperty('Imaging')
        let imaging = videoSources.Imaging
        expect(imaging).toHaveProperty('BacklightCompensation')
        expect(imaging.BacklightCompensation).toHaveProperty('Level')
        expect(imaging.BacklightCompensation).toHaveProperty('Mode')
        expect(imaging).toHaveProperty('Brightness')
        expect(imaging).toHaveProperty('ColorSaturation')
        expect(imaging).toHaveProperty('Contrast')
        expect(imaging).toHaveProperty('Exposure')
        expect(imaging.Exposure).toHaveProperty('ExposureTime')
        expect(imaging.Exposure).toHaveProperty('Gain')
        expect(imaging.Exposure).toHaveProperty('Iris')
        expect(imaging.Exposure).toHaveProperty('MaxExposureTime')
        expect(imaging.Exposure).toHaveProperty('MaxGain')
        expect(imaging.Exposure).toHaveProperty('MaxIris')
        expect(imaging.Exposure).toHaveProperty('MinExposureTime')
        expect(imaging.Exposure).toHaveProperty('MinGain')
        expect(imaging.Exposure).toHaveProperty('MinIris')
        expect(imaging.Exposure).toHaveProperty('Mode')
        expect(imaging.Exposure).toHaveProperty('Priority')
        expect(imaging.Exposure).toHaveProperty('Window')
        expect(imaging.Exposure.Window).toHaveProperty('$')
        expect(imaging.Exposure.Window.$).toHaveProperty('bottom')
        expect(imaging.Exposure.Window.$).toHaveProperty('left')
        expect(imaging.Exposure.Window.$).toHaveProperty('right')
        expect(imaging.Exposure.Window.$).toHaveProperty('top')
        expect(imaging).toHaveProperty('Focus')
        expect(imaging.Focus).toHaveProperty('AutoFocusMode')
        expect(imaging.Focus).toHaveProperty('DefaultSpeed')
        expect(imaging.Focus).toHaveProperty('FarLimit')
        expect(imaging.Focus).toHaveProperty('NearLimit')
        expect(imaging).toHaveProperty('IrCutFilter')
        expect(imaging).toHaveProperty('Sharpness')
        expect(imaging).toHaveProperty('WhiteBalance')
        expect(imaging.WhiteBalance).toHaveProperty('CbGain')
        expect(imaging.WhiteBalance).toHaveProperty('CrGain')
        expect(imaging.WhiteBalance).toHaveProperty('Mode')
        expect(imaging).toHaveProperty('WideDynamicRange')
        expect(imaging.WideDynamicRange).toHaveProperty('Level')
        expect(imaging.WideDynamicRange).toHaveProperty('Mode')
        expect(videoSources).toHaveProperty('Resolution')
        expect(videoSources.Resolution).toHaveProperty('Height')
        expect(videoSources.Resolution).toHaveProperty('Width')
      })
  })

  test('Camera.media.getVideoSources (Callback)', (done) => {
    Camera.media.getVideoSources((error, results) => {
      if (!error) {
        let response = results.data.GetVideoSourcesResponse
        expect(response).toHaveProperty('VideoSources')
        let videoSources = response.VideoSources
        expect(videoSources).toHaveProperty('$')
        expect(videoSources.$).toHaveProperty('token')
        expect(videoSources).toHaveProperty('Framerate')
        expect(videoSources).toHaveProperty('Imaging')
        let imaging = videoSources.Imaging
        expect(imaging).toHaveProperty('BacklightCompensation')
        expect(imaging.BacklightCompensation).toHaveProperty('Level')
        expect(imaging.BacklightCompensation).toHaveProperty('Mode')
        expect(imaging).toHaveProperty('Brightness')
        expect(imaging).toHaveProperty('ColorSaturation')
        expect(imaging).toHaveProperty('Contrast')
        expect(imaging).toHaveProperty('Exposure')
        expect(imaging.Exposure).toHaveProperty('ExposureTime')
        expect(imaging.Exposure).toHaveProperty('Gain')
        expect(imaging.Exposure).toHaveProperty('Iris')
        expect(imaging.Exposure).toHaveProperty('MaxExposureTime')
        expect(imaging.Exposure).toHaveProperty('MaxGain')
        expect(imaging.Exposure).toHaveProperty('MaxIris')
        expect(imaging.Exposure).toHaveProperty('MinExposureTime')
        expect(imaging.Exposure).toHaveProperty('MinGain')
        expect(imaging.Exposure).toHaveProperty('MinIris')
        expect(imaging.Exposure).toHaveProperty('Mode')
        expect(imaging.Exposure).toHaveProperty('Priority')
        expect(imaging.Exposure).toHaveProperty('Window')
        expect(imaging.Exposure.Window).toHaveProperty('$')
        expect(imaging.Exposure.Window.$).toHaveProperty('bottom')
        expect(imaging.Exposure.Window.$).toHaveProperty('left')
        expect(imaging.Exposure.Window.$).toHaveProperty('right')
        expect(imaging.Exposure.Window.$).toHaveProperty('top')
        expect(imaging).toHaveProperty('Focus')
        expect(imaging.Focus).toHaveProperty('AutoFocusMode')
        expect(imaging.Focus).toHaveProperty('DefaultSpeed')
        expect(imaging.Focus).toHaveProperty('FarLimit')
        expect(imaging.Focus).toHaveProperty('NearLimit')
        expect(imaging).toHaveProperty('IrCutFilter')
        expect(imaging).toHaveProperty('Sharpness')
        expect(imaging).toHaveProperty('WhiteBalance')
        expect(imaging.WhiteBalance).toHaveProperty('CbGain')
        expect(imaging.WhiteBalance).toHaveProperty('CrGain')
        expect(imaging.WhiteBalance).toHaveProperty('Mode')
        expect(imaging).toHaveProperty('WideDynamicRange')
        expect(imaging.WideDynamicRange).toHaveProperty('Level')
        expect(imaging.WideDynamicRange).toHaveProperty('Mode')
        expect(videoSources).toHaveProperty('Resolution')
        expect(videoSources.Resolution).toHaveProperty('Height')
        expect(videoSources.Resolution).toHaveProperty('Width')
      }
      done()
    })
  })

  test('Camera.media.getVideoSourceConfigurations (Promise)', () => {
    return Camera.media.getVideoSourceConfigurations()
      .then(results => {
        let response = results.data.GetVideoSourceConfigurationsResponse
        expect(response).toHaveProperty('Configurations')
        let config = response.Configurations
        expect(config).toHaveProperty('$')
        expect(config.$).toHaveProperty('token')
        expect(config).toHaveProperty('Bounds')
        expect(config.Bounds).toHaveProperty('$')
        expect(config.Bounds.$).toHaveProperty('height')
        expect(config.Bounds.$).toHaveProperty('width')
        expect(config.Bounds.$).toHaveProperty('x')
        expect(config.Bounds.$).toHaveProperty('y')
        expect(config).toHaveProperty('Name')
        expect(config).toHaveProperty('SourceToken')
        expect(config).toHaveProperty('UseCount')
      })
  })

  test('Camera.media.getVideoSourceConfigurations (Callback)', (done) => {
    Camera.media.getVideoSourceConfigurations((error, results) => {
      if (!error) {
        let response = results.data.GetVideoSourceConfigurationsResponse
        expect(response).toHaveProperty('Configurations')
        let config = response.Configurations
        expect(config).toHaveProperty('$')
        expect(config.$).toHaveProperty('token')
        expect(config).toHaveProperty('Bounds')
        expect(config.Bounds).toHaveProperty('$')
        expect(config.Bounds.$).toHaveProperty('height')
        expect(config.Bounds.$).toHaveProperty('width')
        expect(config.Bounds.$).toHaveProperty('x')
        expect(config.Bounds.$).toHaveProperty('y')
        expect(config).toHaveProperty('Name')
        expect(config).toHaveProperty('SourceToken')
        expect(config).toHaveProperty('UseCount')
      }
      done()
    })
  })

  test('Camera.media.getVideoEncoderConfigurations (Promise)', () => {
    return Camera.media.getVideoEncoderConfigurations()
      .then(results => {
        let response = results.data.GetVideoEncoderConfigurationsResponse
        expect(response).toHaveProperty('Configurations')
        let config = response.Configurations
        expect(config.length).toBeTruthy()
      })
  })

  test('Camera.media.getVideoEncoderConfigurations (Callback)', (done) => {
    Camera.media.getVideoEncoderConfigurations((error, results) => {
      if (!error) {
        let response = results.data.GetVideoEncoderConfigurationsResponse
        expect(response).toHaveProperty('Configurations')
        let config = response.Configurations
        expect(config.length).toBeTruthy()
      }
      done()
    })
  })

  test('Camera.media.getAudioSources (Promise)', () => {
    return Camera.media.getAudioSources()
      .then(results => {
        let response = results.data.GetAudioSourcesResponse
        expect(response).toHaveProperty('AudioSources')
        let sources = response.AudioSources
        expect(sources).toHaveProperty('$')
        expect(sources.$).toHaveProperty('token')
        expect(sources).toHaveProperty('Channels')
      })
  })

  test('Camera.media.getAudioSources (Callback)', (done) => {
    Camera.media.getAudioSources((error, results) => {
      if (!error) {
        let response = results.data.GetAudioSourcesResponse
        expect(response).toHaveProperty('AudioSources')
        let sources = response.AudioSources
        expect(sources).toHaveProperty('$')
        expect(sources.$).toHaveProperty('token')
        expect(sources).toHaveProperty('Channels')
      }
      done()
    })
  })

  test('Camera.media.getAudioSourceConfigurations (Promise)', () => {
    return Camera.media.getAudioSourceConfigurations()
      .then(results => {
        let response = results.data.GetAudioSourceConfigurationsResponse
        expect(response).toHaveProperty('Configurations')
        let config = response.Configurations
        expect(config).toHaveProperty('$')
        expect(config.$).toHaveProperty('token')
        expect(config).toHaveProperty('Name')
        expect(config).toHaveProperty('SourceToken')
        expect(config).toHaveProperty('UseCount')
      })
  })

  test('Camera.media.getAudioSourceConfigurations (Callback)', (done) => {
    Camera.media.getAudioSourceConfigurations((error, results) => {
      if (!error) {
        let response = results.data.GetAudioSourceConfigurationsResponse
        expect(response).toHaveProperty('Configurations')
        let config = response.Configurations
        expect(config).toHaveProperty('$')
        expect(config.$).toHaveProperty('token')
        expect(config).toHaveProperty('Name')
        expect(config).toHaveProperty('SourceToken')
        expect(config).toHaveProperty('UseCount')
      }
      done()
    })
  })

  test('Camera.media.getAudioEncoderConfigurations (Promise)', () => {
    return Camera.media.getAudioEncoderConfigurations()
      .then(results => {
        let response = results.data.GetAudioEncoderConfigurationsResponse
        expect(response).toHaveProperty('Configurations')
        let config = response.Configurations
        expect(config).toHaveProperty('$')
        expect(config.$).toHaveProperty('token')
        expect(config).toHaveProperty('Bitrate')
        expect(config).toHaveProperty('Encoding')
        expect(config).toHaveProperty('Multicast')
        expect(config.Multicast).toHaveProperty('Address')
        expect(config.Multicast.Address).toHaveProperty('IPv4Address')
        expect(config.Multicast.Address).toHaveProperty('Type')
        expect(config.Multicast).toHaveProperty('AutoStart')
        expect(config.Multicast).toHaveProperty('Port')
        expect(config.Multicast).toHaveProperty('TTL')
        expect(config).toHaveProperty('Name')
        expect(config).toHaveProperty('SampleRate')
        expect(config).toHaveProperty('SessionTimeout')
        expect(config).toHaveProperty('UseCount')
      })
  })

  test('Camera.media.getAudioEncoderConfigurations (Callback)', (done) => {
    Camera.media.getAudioEncoderConfigurations((error, results) => {
      if (!error) {
        let response = results.data.GetAudioEncoderConfigurationsResponse
        expect(response).toHaveProperty('Configurations')
        let config = response.Configurations
        expect(config).toHaveProperty('$')
        expect(config.$).toHaveProperty('token')
        expect(config).toHaveProperty('Bitrate')
        expect(config).toHaveProperty('Encoding')
        expect(config).toHaveProperty('Multicast')
        expect(config.Multicast).toHaveProperty('Address')
        expect(config.Multicast.Address).toHaveProperty('IPv4Address')
        expect(config.Multicast.Address).toHaveProperty('Type')
        expect(config.Multicast).toHaveProperty('AutoStart')
        expect(config.Multicast).toHaveProperty('Port')
        expect(config.Multicast).toHaveProperty('TTL')
        expect(config).toHaveProperty('Name')
        expect(config).toHaveProperty('SampleRate')
        expect(config).toHaveProperty('SessionTimeout')
        expect(config).toHaveProperty('UseCount')
      }
      done()
    })
  })

  test('Camera.media.getVideoAnalyticsConfigurations (Promise)', () => {
    return Camera.media.getVideoAnalyticsConfigurations()
      .then(results => {
        let response = results.data.GetVideoAnalyticsConfigurationsResponse
        expect(response).toHaveProperty('Configurations')
        let config = response.Configurations
        expect(config).toHaveProperty('$')
        expect(config.$).toHaveProperty('token')
        expect(config).toHaveProperty('AnalyticsEngineConfiguration')
        expect(config.AnalyticsEngineConfiguration).toHaveProperty('AnalyticsModule')
        expect(config.AnalyticsEngineConfiguration.AnalyticsModule.length).toBeTruthy()
        expect(config).toHaveProperty('Name')
        expect(config).toHaveProperty('RuleEngineConfiguration')
        expect(config.RuleEngineConfiguration).toHaveProperty('Rule')
        expect(config.RuleEngineConfiguration.Rule.length).toBeTruthy()
        expect(config).toHaveProperty('UseCount')
      })
  })

  test('Camera.media.getVideoAnalyticsConfigurations (Callback)', (done) => {
    Camera.media.getVideoAnalyticsConfigurations((error, results) => {
      if (!error) {
        let response = results.data.GetVideoAnalyticsConfigurationsResponse
        expect(response).toHaveProperty('Configurations')
        let config = response.Configurations
        expect(config).toHaveProperty('$')
        expect(config.$).toHaveProperty('token')
        expect(config).toHaveProperty('AnalyticsEngineConfiguration')
        expect(config.AnalyticsEngineConfiguration).toHaveProperty('AnalyticsModule')
        expect(config.AnalyticsEngineConfiguration.AnalyticsModule.length).toBeTruthy()
        expect(config).toHaveProperty('Name')
        expect(config).toHaveProperty('RuleEngineConfiguration')
        expect(config.RuleEngineConfiguration).toHaveProperty('Rule')
        expect(config.RuleEngineConfiguration.Rule.length).toBeTruthy()
        expect(config).toHaveProperty('UseCount')
      }
      done()
    })
  })

  test('Camera.media.getMetadataConfigurations (Promise)', () => {
    return Camera.media.getMetadataConfigurations()
      .then(results => {
        let response = results.data.GetMetadataConfigurationsResponse
        expect(response).toHaveProperty('Configurations')
        let config = response.Configurations
        expect(config).toHaveProperty('$')
        expect(config.$).toHaveProperty('token')
        expect(config).toHaveProperty('Analytics')
        expect(config).toHaveProperty('AnalyticsEngineConfiguration')
        expect(config).toHaveProperty('Multicast')
        expect(config.Multicast).toHaveProperty('Address')
        expect(config.Multicast.Address).toHaveProperty('IPv4Address')
        expect(config.Multicast.Address).toHaveProperty('Type')
        expect(config.Multicast).toHaveProperty('AutoStart')
        expect(config.Multicast).toHaveProperty('Port')
        expect(config.Multicast).toHaveProperty('TTL')
        expect(config).toHaveProperty('Name')
        expect(config).toHaveProperty('PTZStatus')
        expect(config.PTZStatus).toHaveProperty('Position')
        expect(config.PTZStatus).toHaveProperty('Status')
        expect(config).toHaveProperty('SessionTimeout')
        expect(config).toHaveProperty('UseCount')
      })
  })
})

test('Camera.media.getMetadataConfigurations (Callback)', (done) => {
  Camera.media.getMetadataConfigurations((error, results) => {
    if (!error) {
      let response = results.data.GetMetadataConfigurationsResponse
      expect(response).toHaveProperty('Configurations')
      let config = response.Configurations
      expect(config).toHaveProperty('$')
      expect(config.$).toHaveProperty('token')
      expect(config).toHaveProperty('Analytics')
      expect(config).toHaveProperty('AnalyticsEngineConfiguration')
      expect(config).toHaveProperty('Multicast')
      expect(config.Multicast).toHaveProperty('Address')
      expect(config.Multicast.Address).toHaveProperty('IPv4Address')
      expect(config.Multicast.Address).toHaveProperty('Type')
      expect(config.Multicast).toHaveProperty('AutoStart')
      expect(config.Multicast).toHaveProperty('Port')
      expect(config.Multicast).toHaveProperty('TTL')
      expect(config).toHaveProperty('Name')
      expect(config).toHaveProperty('PTZStatus')
      expect(config.PTZStatus).toHaveProperty('Position')
      expect(config.PTZStatus).toHaveProperty('Status')
      expect(config).toHaveProperty('SessionTimeout')
      expect(config).toHaveProperty('UseCount')
    }
    done()
  })
})
