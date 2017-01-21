'use strict'

module.exports = function (opts) {
  var gain = opts.gain || 127
  var sampleRate = opts.sampleRate || 10e6
  var samplesPerMs = sampleRate / 1000
  var samplesPerSymbol = Math.ceil(samplesPerMs * opts.symbolPeriod)

  return function encode (data) {
    var symbols = data.split('').map(toNumber)
    var totalSamples = symbols.length * samplesPerSymbol
    var I = sin(opts.freq, gain, sampleRate, samplesPerSymbol)
    var Q = cos(opts.freq, gain, sampleRate, samplesPerSymbol)
    var on = complex(I, Q)

    var encoded = Buffer.alloc(totalSamples * 2)

    symbols.forEach(function (symbol, index) {
      if (!symbol) return
      var offset = index * samplesPerSymbol * 2
      on.copy(encoded, offset)
    })

    return encoded
  }
}

function complex (I, Q) {
  var buf = Buffer(I.length * 2)
  for (var i = 0; i < I.length; i++) {
    buf.writeInt8(I.readInt8(i), i * 2)
    buf.writeInt8(Q.readInt8(i), i * 2 + 1)
  }
  return buf
}

function sin (freq, gain, sampleRate, samples) {
  return gen(Math.sin, freq, gain, sampleRate, samples)
}

function cos (freq, gain, sampleRate, samples) {
  return gen(Math.cos, freq, gain, sampleRate, samples)
}

function gen (waveFn, freq, gain, sampleRate, samples) {
  var buf = Buffer(samples)
  for (var t = 0; t < samples; t++) {
    buf.writeInt8(gain * waveFn(2 * Math.PI * freq * t))
  }
  return buf
}

function toNumber (s) {
  return parseInt(s, 10)
}
