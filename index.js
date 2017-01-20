'use strict'

var debug = require('debug')('monster-drift')
delete process.env.DEBUG // hackrf doesn't like this flag

var fs = require('fs')
var devices = require('hackrf')()

var signal = {
  f: fs.readFileSync('./recordings/car-f.raw'),
  b: fs.readFileSync('./recordings/car-b.raw'),
  l: fs.readFileSync('./recordings/car-r.raw'),
  r: fs.readFileSync('./recordings/car-l.raw'),
  fr: fs.readFileSync('./recordings/car-fl.raw'),
  fl: fs.readFileSync('./recordings/car-fr.raw'),
  br: fs.readFileSync('./recordings/car-bl.raw'),
  bl: fs.readFileSync('./recordings/car-br.raw')
}
signal.f.name = 'forward'
signal.b.name = 'backward'
signal.l.name = 'left'
signal.r.name = 'right'
signal.fr.name = 'forward/right'
signal.fl.name = 'forward/left'
signal.br.name = 'backward/right'
signal.bl.name = 'backward/left'

module.exports = MonsterDrift

function MonsterDrift (opts) {
  if (!(this instanceof MonsterDrift)) return new MonsterDrift()

  if (!opts) opts = {}

  this._freq = opts.freq || 27e6
  this._index = 0
  this._stream = null

  this._device = devices.open(opts.id || 0)
  this._device.setTxGain(opts.gain || 40) // TX VGA (IF) gain, 0-47 dB in 1 dB steps
  this._device.setFrequency(this._freq)
}

MonsterDrift.prototype.uturn = function (cb) {
  var self = this
  this.forward()
  setTimeout(function () {
    if (Math.random() < 0.5) self.right()
    else self.left()
    setTimeout(function () {
      self.backward()
      setTimeout(function () {
        cb()
      }, 1000)
    }, 200)
  }, 1000)
}

MonsterDrift.prototype.start = function () {
  var self = this
  debug('starting')
  this._device.startTx(function (buf, cb) {
    var i
    if (self._stream) {
      for (i = 0; i < buf.length; i++) {
        buf[i] = self._stream[self._index++]
        if (self._index === self._stream.length) self._index = 0
      }
    } else {
      for (i = 0; i < buf.length; i++) buf[i] = 0
    }
    cb()
  })
}

MonsterDrift.prototype.stop = function (cb) {
  if (!this._stream) return
  debug('stopping')
  this._stream = null
  this._device.stopTx(function () {
    debug('stopped!')
    if (cb) cb()
  })
}

MonsterDrift.prototype.close = function (cb) {
  var self = this
  this._device.stopTx(function () {
    self._device.close(cb)
  })
}

MonsterDrift.prototype.left = function () {
  this._drive(signal.l)
}

MonsterDrift.prototype.right = function () {
  this._drive(signal.r)
}

MonsterDrift.prototype.forward = function () {
  this._drive(signal.f)
}

MonsterDrift.prototype.forwardRight = function () {
  this._drive(signal.fr)
}

MonsterDrift.prototype.forwardLeft = function () {
  this._drive(signal.fl)
}

MonsterDrift.prototype.backward = function () {
  this._drive(signal.b)
}

MonsterDrift.prototype.backwardRight = function () {
  this._drive(signal.br)
}

MonsterDrift.prototype.backwardLeft = function () {
  this._drive(signal.bl)
}

MonsterDrift.prototype._drive = function (s) {
  debug(s.name)
  if (this._stream === s) return
  else if (!this._stream) this.start()

  debug('new direction')
  this._index = 0
  this._stream = s
}
