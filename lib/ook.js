'use strict'

module.exports = function (opts) {
  var gain = opts.gain || 127
  var sampleRate = opts.sampleRate || 10e6
  var samplesPerSymbol = Math.ceil(sampleRate / 1000 * opts.symbolPeriod)
  var onSymbol = complexWave(opts.freq, gain, samplesPerSymbol)

  return function encode (data) {
    var symbols = data.split('')
    var totalSamples = symbols.length * samplesPerSymbol
    var encoded = Buffer.alloc(totalSamples * 2)

    symbols.forEach(function (symbol, index) {
      if (symbol === '0') return
      var offset = index * samplesPerSymbol * 2
      onSymbol.copy(encoded, offset)
    })

    return encoded
  }
}

function complexWave (freq, amplitute, numOfSamples) {
  var buf = Buffer(numOfSamples * 2)
  var angle
  for (var t = 0; t < numOfSamples; t++) {
    angle = 2 * Math.PI * freq * t
    buf.writeInt8(amplitute * Math.sin(angle), t * 2)
    buf.writeInt8(amplitute * Math.cos(angle), t * 2 + 1)
  }
  return buf
}
