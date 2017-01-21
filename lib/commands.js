'use strict'

var preamble = '1110111011101110'

module.exports = {
  f: [gen(10), 'forward'],
  fl: [gen(28), 'forward/left'],
  fr: [gen(34), 'forward/right'],
  r: [gen(40), 'reverse'],
  rl: [gen(46), 'reverse/left'],
  rr: [gen(52), 'reverse/right'],
  wr: [gen(58), 'right'],
  wl: [gen(64), 'left']
}

function gen (n) {
  return preamble + Array(n + 1).join('10')
}
