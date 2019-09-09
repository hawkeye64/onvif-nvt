'use strict'

describe('#Camera', () => {
  test('Camera::constructor()', () => {
    const Camera = require('../lib/camera')
    const camera = new Camera()

    expect(camera.media).toBeNull()
    expect(camera.ptz).toBeNull()
    expect(camera.imaging).toBeNull()
    expect(camera.events).toBeNull()
    expect(camera.recording).toBeNull()
    expect(camera.replay).toBeNull()
    expect(camera.snapshot).toBeNull()
  })

  test('Camera::add(moduleName)', () => {
    const Camera = require('../lib/camera')
    const camera = new Camera()

    camera.add('access')
    expect(camera.access).not.toBeNull()

    camera.add('accessrules')
    expect(camera.accessrules).not.toBeNull()

    camera.add('action')
    expect(camera.action).not.toBeNull()

    camera.add('credential')
    expect(camera.credential).not.toBeNull()

    camera.add('deviceio')
    expect(camera.deviceio).not.toBeNull()

    camera.add('display')
    expect(camera.display).not.toBeNull()

    camera.add('door')
    expect(camera.door).not.toBeNull()

    camera.add('events')
    expect(camera.events).not.toBeNull()

    camera.add('imaging')
    expect(camera.imaging).not.toBeNull()

    camera.add('media')
    expect(camera.media).not.toBeNull()

    camera.add('media2')
    expect(camera.media2).not.toBeNull()

    camera.add('ptz')
    expect(camera.ptz).not.toBeNull()

    camera.add('receiver')
    expect(camera.receiver).not.toBeNull()

    camera.add('recording')
    expect(camera.recording).not.toBeNull()

    camera.add('replay')
    expect(camera.replay).not.toBeNull()

    camera.add('security')
    expect(camera.security).not.toBeNull()

    camera.add('snapshot')
    expect(camera.snapshot).not.toBeNull()

    camera.add('thermal')
    expect(camera.thermal).not.toBeNull()

    camera.add('videoanalytics')
    expect(camera.videoanalytics).not.toBeNull()
  })
})
