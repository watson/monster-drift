'use strict'

module.exports = function (opts) {
  var gain = opts.gain || 127
  var sampleRate = opts.sampleRate || 10e6
  var samplesPerSymbol = Math.ceil(sampleRate / 1000 * opts.symbolPeriod)

  return function encode (data) {
    var symbols = data.split('').map(toNumber)
    var totalSamples = symbols.length * samplesPerSymbol
    var I = sin(opts.freq, gain, samplesPerSymbol)
    var Q = cos(opts.freq, gain, samplesPerSymbol)
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
    buf.writeInt8(I[i], i * 2)
    buf.writeInt8(Q[i], i * 2 + 1)
  }
  return buf
}

function sin (freq, amplitute, samples) {
  return gen(Math.sin, freq, amplitute, samples)
}

function cos (freq, amplitute, samples) {
  return gen(Math.cos, freq, amplitute, samples)
}

function gen (waveFn, freq, amplitute, samples) {
  var arr = []
  for (var t = 0; t < samples; t++) {
    arr.push(amplitute * waveFn(2 * Math.PI * freq * t))
  }
  return arr
}

function toNumber (s) {
  return parseInt(s, 10)
}
