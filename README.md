# monster-drift

📻🏎 Drive a radio controlled car with Node.js and HackRF. This module
should work with most radio controlled cars operating on a frequency of
27MHz.

[![Build status](https://travis-ci.org/watson/monster-drift.svg?branch=master)](https://travis-ci.org/watson/monster-drift)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

[![180 turn](http://img.youtube.com/vi/XtUH5GbOzug/0.jpg)](https://www.youtube.com/watch?v=XtUH5GbOzug)

## Contributions

Contributions are welcome! Add your own tricks and manoeuvres and make a Pull Request 🤕🙈✌️

## Installation

Use from the command line:

```
npm install monster-drift --global
```

Use programmatically:

```
npm install monster-drift --save
```

## CLI Usage

Simply run the `monster-drift` command to start. Use `--help` to get
help.

## Programmatic Usage

Drive forward for one seconds and stop:

```js
var drive = require('monster-drift')()

drive.forward()

setTimeout(function () {
  drive.stop()
}, 1000)
```

## API

Some cars might not support all commands.

### `var drive = new MonsterDrift([options])`

This module exposes a `MonsterDrift` object that you can initiate to get
a `drive` object.

Options:

- `channel` - The channel to transmit on in [the 27 MHz
  band](http://www.ukrcc.org/27mhz.html) (default: `19`)
- `freq` - The frequency in Hz to transmit on (overwrites `channel`)
- `speed` - The default forward speed. Must be between 1 and 3 (default:
  `1`). Can be overwritten with `drive.forward(speed)` (experimental)
- `swaplr` - Boolean for inverting left and right (default: `false`)
- `stop` - Milliseconds in which to automatically stop the card if no
  drive commands have been issued (default: never)
- `id` - The HackRF device id to use (default: `0`)
- `gain` - The HackRF TX gain (default: `47`)
- `sampleRate` - The sample rate used when transmitting (default:
  `10e6`)

### `drive.forward([speed])`

Drive forward.

An optional `speed` can be given between 1 and 3. The default speed is
`1`. Note that not all cars support all speeds.

### `drive.reverse()`

Drive reverse.

### `drive.left()`

Turn wheels left.

### `drive.right()`

Turn wheels right.

### `drive.forwardRight()`

Drive forward while turning right.

### `drive.forwardLeft()`

Drive forward while turning left.

### `drive.reverseRight()`

Drive reverse while turning right.

### `drive.reverseLeft()`

Drive reverse while turning left.

### `drive.stop([callback])`

Stop the car and turn off transmitter. Calls optional `callback` when
done.

### `drive.close([callback])`

Stop the car, turn off transmitter and close the HackRF USB connection.
Calls optional `callback` when done.

### `drive.turn180([callback])`

Make a 180. Calls `callback` when done.

### `drive.batch(commands[, callback])`

Issue a series of driving commands to the car and call optional
`callback` when done.

The `commands` argument is an array of commands. Each command is a
double tuple with the following format: `[function, duration]`. The
`function` part is a drive function, e.g. `drive.forward`, and the
`duration` part is the number of milliseconds to perform the operation.

If the last tuple contains a `duration` then `drive.stop` will be called
automatically. Leave out `duratuon` to continue forever.

```js
// make a 180
drive.batch([
  [drive.forward, 1000],
  [drive.right, 125],
  [drive.reverseLeft, 100],
  [drive.reverse]
])
```

## License

MIT
