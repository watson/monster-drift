'use strict'

var keypress = require('keypress')
var drive = require('./')()

var timer

keypress(process.stdin)
process.stdin.on('keypress', function (ch, key) {
  if (key && key.ctrl && key.name === 'c') return exit()

  clearTimeout(timer)

  switch (key.name) {
    case 'w': drive.forward(); break
    case 'q': drive.forwardRight(); break
    case 'e': drive.forwardLeft(); break
    case 's': drive.reverse(); break
    case 'a': drive.reverseRight(); break
    case 'd': drive.reverseLeft(); break
    case 'z': drive.left(); break
    case 'c': drive.right(); break
    case 'u': return drive.turn180(stop) // 180 stops automatically
  }

  timer = setTimeout(stop, 150)

  function stop () {
    drive.stop()
  }
})
process.stdin.setRawMode(true)
process.stdin.resume()

function exit () {
  drive.close(function () {
    process.exit()
  })
}
