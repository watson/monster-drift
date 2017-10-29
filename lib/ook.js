'use strict'

module.exports = function (opts) {
  var gain = opts.gain || 127 // convert from -1 -> +1 to -127 -> +127 (8-bit short)
  var freq = opts.freq || 0
  var sampleRate = opts.sampleRate || 8e6
  var samplesPerSymbol = Math.ceil(sampleRate / 1000 * opts.symbolPeriod)
  var onSymbol = genOnSymbol(freq, sampleRate, gain, samplesPerSymbol)

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

function genOnSymbol (freq, sampleRate, amplitute, numOfSamples) {
  var symbol = Buffer.alloc(numOfSamples * 2)
  var timeBetweenSamples = 1 / sampleRate
  var t = 0
  for (var i = 0; i < numOfSamples * 2;) {
    symbol.writeInt8(amplitute * Math.cos(2 * Math.PI * freq * t), i++)
    symbol.writeInt8(amplitute * Math.sin(2 * Math.PI * freq * t), i++)
    t += timeBetweenSamples
  }
  return symbol
}
