# monster-drift

📻🏎 Drive a remote controlled drift car with Node.js and HackRF.
This is beta software.

[![Build status](https://travis-ci.org/watson/monster-drift.svg?branch=master)](https://travis-ci.org/watson/monster-drift)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

[![uturn](http://img.youtube.com/vi/XtUH5GbOzug/0.jpg)](https://www.youtube.com/watch?v=XtUH5GbOzug)

## Installation

```
npm install monster-drift --save
```

## Usage

Drive forward for one seconds and stop:

```js
var drive = require('monster-drift')()

drive.forward()

setTimeout(function () {
  drive.stop()
}, 1000)
```

## API

### `var drive = new MonsterDrift([options])`

This module exposes a `MonsterDrift` object that you can initiate to get
a `drive` object.

Options:

- `stop` - Milliseconds in which to automatically stop the card if no
  drive commands have been issued (default: never)
- `freq` - The frequency in Hz (default: 27MHz)
- `id` - The HackRF device id to use (default: `0`)
- `gain` - The HackRF TX gain (default: `40`)

### `drive.forward()`

Drive forward.

### `drive.backward()`

Drive backward.

### `drive.left()`

Turn wheels left.

### `drive.right()`

Turn wheels right.

### `drive.forwardRight()`

Drive forward and right.

### `drive.forwardLeft()`

Drive forward and left.

### `drive.backwardRight()`

Drive backward and turn right.

### `drive.backwardLeft()`

Drive backward and turn left.

### `drive.stop()`

Stop the car.

### `drive.close()`

Close the HackRF radio.

### `drive.uturn([callback])`

Make a uturn. Calls `callback` when done.

## License

MIT
