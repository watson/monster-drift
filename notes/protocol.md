# 27MHz Radio Controlled Toy Car Command Protocol

Many 27MHz radio controlled toy cars uses a simple [On-Off
Keying](https://en.wikipedia.org/wiki/On-off_keying) (OOK) modulation to
transmit commands to the car.

The protocol that these car uses is described in this document.

Note that some cars will revert left and right!

## Data Symbol

|            |           |
| ---------- | --------- |
| **Rate**   | 2.1561kHz |
| **Period** | 463.8µs   |

## Preamble

```
1110 1110
1110 1110
```

## Stop

Preamble + 4 x `10` data symbols

```
11 10 11 10 # preamble
11 10 11 10
10 10 10 10 # command
```

This is normally sent automatically when you release the remote control
trigger.

## Forward (speed 1)

Preamble + 10 x `10` data symbols

```
11 10 11 10 # preamble
11 10 11 10
10 10 10 10 # command
10 10 10 10
10 10
```

## Forward (speed 2)

Preamble + 16 x `10` data symbols

```
11 10 11 10 # preamble
11 10 11 10
10 10 10 10 # command
10 10 10 10
10 10 10 10
10 10 10 10
```

**Note:** This is untested but seen in specs found online.

**Observation:** Some cars will interpret this as speed 1.

## Forward (speed 3)

Preamble + 22 x `10` data symbols

```
11 10 11 10 # preamble
11 10 11 10
10 10 10 10 # command
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10
```

**Note:** This is untested and teoretical.

## Forward+Right

Preamble + 28 x `10` data symbols

```
11 10 11 10 # preamble
11 10 11 10
10 10 10 10 # command
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
```

## Forward+Left

Preamble + 34 x `10` data symbols

```
11 10 11 10 # preamble
11 10 11 10
10 10 10 10 # command
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10
```

## Reverse

Preamble + 40 x `10` data symbols

```
11 10 11 10 # preamble
11 10 11 10
10 10 10 10 # command
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
```

## Reverse+Left

Preamble + 46 x `10` data symbols

```
11 10 11 10 # preamble
11 10 11 10
10 10 10 10 # command
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10
```

## Reverse+Right

Preamble + 52 x `10` data symbols

```
11 10 11 10 # preamble
11 10 11 10
10 10 10 10 # command
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
```

## Wheels Right

Preamble + 58 x `10` data symbols

```
11 10 11 10 # preamble
11 10 11 10
10 10 10 10 # command
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10
```

## Wheels Left

Preamble + 64 x `10` data symbols

```
11 10 11 10 # preamble
11 10 11 10
10 10 10 10 # command
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
10 10 10 10
```
