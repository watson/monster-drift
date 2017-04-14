#!/usr/bin/env node
'use strict'

var argv = require('minimist')(process.argv.slice(2))
var keypress = require('keypress')
var MonsterDrift = require('./')
var pkg = require('./package')

var drive, timer

if (argv.h || argv.help) help()
else if (argv.v || argv.version) version()
else run()

function run () {
  console.log('Connecting to radio...')

  drive = new MonsterDrift({
    channel: argv.c || argv.channel,
    freq: argv.f || argv.freq,
    speed: argv.speed,
    swaplr: argv.swaplr,
    id: argv.d || argv.id,
    gain: argv.gain,
    sampleRate: argv['sample-rate']
  })

  console.log('Found radio!')
  console.log('Use keys to drive - Run with --help for details')

  keypress(process.stdin)
  process.stdin.on('keypress', function (ch, key) {
    if (!key) return
    if (key && key.ctrl && key.name === 'c') return exit()

    clearTimeout(timer)

    switch (key.name) {
      case 'w': drive.forward(); break
      case 'q': drive.forwardLeft(); break
      case 'e': drive.forwardRight(); break
      case 's': drive.reverse(); break
      case 'a': drive.reverseLeft(); break
      case 'd': drive.reverseRight(); break
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
}

function help () {
  console.log(`
Usage:
  monster-drift [options]

Options:
  -h, --help       Show this message
  -v, --version    Show version
  -c, --channel=N  Set transmit channel (default: 19)
  --freq=Hz        Set transmit frequency (overwrites --channel)
  --speed=N        Set default forward speed (1-3, default: 1)
  --swaplr         Invert left/right stearing
  -d, --id         HackRF device id (default: 0)
  --gain           HackRF TX gain (default: 47)
  --sample-rate    Sample rate used when transmitting (default: 10e6)

Use the keyboard to drive.

Basic driving:
  w: Forward
  q: Forward/Right
  e: Forward/Left
  s: Reverse
  a: Reverse/Right
  d: Reverse/Left
  z: Wheels Left
  c: Wheels Right

Tricks:
  u: Turn 180

Exit by pressing ctrl+c

P.S. A high key-repeat will improve the experience :)
  `)
}

function version () {
  console.log(pkg.version)
}

function exit () {
  drive.close(function () {
    process.exit()
  })
}
