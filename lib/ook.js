'use strict'

module.exports = function (opts) {
  var gain = opts.gain || 127 // convert from -1 -> +1 to -127 -> +127 (8-bit short)
  var sampleRate = opts.sampleRate || 8e6
  var samplesPerSymbol = Math.ceil(sampleRate / 1000 * opts.symbolPeriod)
  var onSymbol = genOnSymbol(gain, samplesPerSymbol)

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

function genOnSymbol (amplitute, numOfSamples) {
  var val = Math.cos(Math.PI / 4) * amplitute // at 45 degrees, cos(45) === sin(45)
  return Buffer.alloc(numOfSamples * 2, val)
}
