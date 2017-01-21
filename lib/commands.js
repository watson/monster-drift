'use strict'

var preamble = '1110111011101110'

module.exports = {
  f: [gen(10), 'forward'],
  fl: [gen(28), 'forward/left'],
  fr: [gen(34), 'forward/right'],
  b: [gen(40), 'backward'],
  bl: [gen(46), 'backward/left'],
  br: [gen(52), 'backward/right'],
  r: [gen(58), 'right'],
  l: [gen(64), 'left']
}

function gen (n) {
  return preamble + Array(n + 1).join('10')
}
