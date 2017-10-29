'use strict'

var channel = require('27mhz')
var devices = require('hackrf')()
var debug = require('debug')('monster-drift')
var ook = require('./lib/ook')
var commands = require('./lib/commands')

module.exports = MonsterDrift

function MonsterDrift (opts) {
  if (!(this instanceof MonsterDrift)) return new MonsterDrift()
  if (!opts) opts = {}

  var tuningFreq = opts.freq ? opts.freq - 100e3 : 27e6
  var offsetFreq = opts.freq ? 100e3 : channel(opts.channel || 19) - 27e6
  var sampleRate = opts.sampleRate || 8e6

  this._index = 0
  this._stream = null
  this._speed = opts.speed || 1
  this._inverted = opts.swaplr || false
  this._stopIn = opts.stop || null
  this._stopTimer = null

  var encode = ook({
    freq: offsetFreq,
    sampleRate: sampleRate,
    symbolPeriod: 0.4638 // in milliseconds
  })

  var self = this
  this._signal = {}
  Object.keys(commands).forEach(function (key) {
    var cmd = commands[key]
    self._signal[key] = encode(cmd[0])
    self._signal[key].name = cmd[1]
  })

  this._device = devices.open(opts.id || 0)
  this._device.setTxGain(opts.gain || 47) // TX VGA (IF) gain, 0-47 dB in 1 dB steps
  this._device.setFrequency(tuningFreq)
  this._device.setSampleRate(sampleRate)
}

MonsterDrift.prototype.turn180 = function (cb) {
  this.batch([
    [this.forward, 1000],
    [this.right, 125],
    [this.reverseLeft, 100],
    [this.reverse, 1000]
  ], cb)
}

MonsterDrift.prototype._start = function () {
  var self = this
  debug('starting')
  this._device.startTx(function (buf, cb) {
    if (self._stream) {
      for (var i = 0; i < buf.length; i++) {
        buf[i] = self._stream[self._index++]
        if (self._index === self._stream.length) self._index = 0
      }
    } else {
      buf.fill(0)
    }
    cb()
  })
}

MonsterDrift.prototype.stop = function (cb) {
  if (!this._stream) return cb ? cb() : null
  debug('stopping')
  this._stream = null
  this._device.stopTx(function () {
    debug('stopped!')
    if (cb) cb()
  })
}

MonsterDrift.prototype.close = function (cb) {
  var self = this
  this.stop(function () {
    self._device.close(cb)
  })
}

MonsterDrift.prototype.forward = function (speed) {
  switch (speed || this._speed) {
    case 3: return this._drive(this._signal.fff)
    case 2: return this._drive(this._signal.ff)
    default: this._drive(this._signal.f)
  }
}

MonsterDrift.prototype.forwardLeft = function () {
  this._drive(this._inverted ? this._signal.fr : this._signal.fl)
}

MonsterDrift.prototype.forwardRight = function () {
  this._drive(this._inverted ? this._signal.fl : this._signal.fr)
}

MonsterDrift.prototype.reverse = function () {
  this._drive(this._signal.r)
}

MonsterDrift.prototype.reverseLeft = function () {
  this._drive(this._inverted ? this._signal.rr : this._signal.rl)
}

MonsterDrift.prototype.reverseRight = function () {
  this._drive(this._inverted ? this._signal.rl : this._signal.rr)
}

MonsterDrift.prototype.right = function () {
  this._drive(this._inverted ? this._signal.wl : this._signal.wr)
}

MonsterDrift.prototype.left = function () {
  this._drive(this._inverted ? this._signal.wr : this._signal.wl)
}

MonsterDrift.prototype.batch = function (commands, cb) {
  var self = this
  next()

  function next (i) {
    i = i || 0
    var command = commands[i]
    if (!command) return self.stop(cb)
    var fn = command[0]
    var ms = command[1]
    fn.call(self)
    if (ms) {
      setTimeout(function () {
        next(++i)
      }, ms)
    } else if (cb) {
      cb()
    }
  }
}

MonsterDrift.prototype._drive = function (s) {
  debug(s.name)
  if (this._stopTimer) clearTimeout(this._stopTimer)
  if (this._stream === s) return
  else if (!this._stream) this._start()

  debug('new direction')
  this._index = 0
  this._stream = s

  if (this._stopIn) {
    var self = this
    this._stopTimer = setTimeout(function () {
      self.stop()
    }, this._stopIn)
  }
}
