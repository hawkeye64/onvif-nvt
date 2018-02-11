describe('#Camera', () => {
  // Discovery
  test('Camera::constructor()', () => {
    const Camera = require('../lib/camera')

    expect(Camera.media).toBeNull()
    expect(Camera.ptz).toBeNull()
    expect(Camera.imaging).toBeNull()
    expect(Camera.events).toBeNull()
    expect(Camera.recording).toBeNull()
    expect(Camera.replay).toBeNull()
    expect(Camera.snapshot).toBeNull()
  })

  // Media
  test(`Camera::add(moduleName)`, () => {
    const Camera = require('../lib/camera')

    Camera.add('access')
    expect(Camera.access).not.toBeNull()

    Camera.add('accessrules')
    expect(Camera.accessrules).not.toBeNull()

    Camera.add('action')
    expect(Camera.action).not.toBeNull()

    Camera.add('credential')
    expect(Camera.credential).not.toBeNull()

    Camera.add('deviceio')
    expect(Camera.deviceio).not.toBeNull()

    Camera.add('display')
    expect(Camera.display).not.toBeNull()

    Camera.add('door')
    expect(Camera.door).not.toBeNull()

    Camera.add('events')
    expect(Camera.events).not.toBeNull()

    Camera.add('imaging')
    expect(Camera.imaging).not.toBeNull()

    Camera.add('media')
    expect(Camera.media).not.toBeNull()

    Camera.add('media2')
    expect(Camera.media2).not.toBeNull()

    Camera.add('ptz')
    expect(Camera.ptz).not.toBeNull()

    Camera.add('receiver')
    expect(Camera.receiver).not.toBeNull()

    Camera.add('recording')
    expect(Camera.recording).not.toBeNull()

    Camera.add('replay')
    expect(Camera.replay).not.toBeNull()

    Camera.add('security')
    expect(Camera.security).not.toBeNull()

    Camera.add('snapshot')
    expect(Camera.snapshot).not.toBeNull()

    Camera.add('thermal')
    expect(Camera.thermal).not.toBeNull()

    Camera.add('videoanalytics')
    expect(Camera.videoanalytics).not.toBeNull()
  })
})
