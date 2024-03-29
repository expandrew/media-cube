# bonk

Custom adapter library to map inputs and outputs for Media Cube

It will map inputs and outputs from the following devices:

- [x] Griffin PowerMate
- [x] Senic Nuimo
- [x] Sonos
- [ ] [blink(1)](https://blink1.thingm.com/)
- [ ] Hue lights
- [ ] `media-cube/cd-player`

## Mappings

|                          | PowerMate               | Nuimo                 |
| ------------------------ | ----------------------- | --------------------- |
| press                    | Sonos Play/Pause        | Sonos Play/Pause      |
| double press             | Sonos Next Track        | _(not supported)_     |
| triple press             | Sonos Previous Track    | _(not supported)_     |
| clockwise                | Sonos Volume Up         | Sonos Volume Up       |
| counterclockwise         | Sonos Volume Down       | Sonos Volume Down     |
| press + clockwise        | Sonos Group Volume Up   | Sonos Group Volume Up |
| press + counterclockwise | Sonos Group Volume Down | Sonos Group Volume Up |
| swipe right              | _(not supported)_       | Sonos Next Track      |
| swipe left               | _(not supported)_       | Sonos Previous Track  |

## Setup

### Node.js

Install Node.js `v14.15.3` on the Raspberry Pi:

```bash
# If nvm isn't installed, install it:
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
$ exec bash

# Install Node.js v14.15.3
$ nvm install 14.15.3
```

### PowerMate

Install drivers:

```bash
$ sudo apt-get install libusb-1.0-0-dev
```

Make a file at `/etc/udev/rules.d/95-powermate.rules` with these contents:

```
SUBSYSTEM=="usb", ATTRS{idVendor}=="077d", ATTRS{idProduct}=="0410", MODE="0666", GROUP="plugdev", SYMLINK+="powermate"
```

(from https://github.com/node-hid/node-hid#linux-notes)

Then reload `udev` rules:

```bash
$ sudo udevadm control --reload-rules
```

### Nuimo

Install and configure drivers for Nuimo (`rocket-nuimo` uses `noble` and they have some setup steps):

```bash
# https://github.com/noble/noble#ubuntudebianraspbian
$ sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev

# https://github.com/noble/noble#running-on-linux
$ sudo setcap cap_net_raw+eip $(eval readlink -f `which node`)
```

### Install dependencies

Install npm dependencies, and build `bonk`:

```bash
$ npm install
$ npm run build
```

### pm2

Install and start the app with `pm2` on the Raspberry Pi

```bash
# Install pm2 globally
$ npm install -g pm2

# Start the app with pm2
$ npm run pm2:start
```

Set up startup scripts for `pm2` to automatically reload `bonk` when the Pi restarts:

```bash
# Make sure the app is running with pm2:
$ npm run pm2:start
# Once bonk is running, set up pm2's startup script:
$ pm2 startup
# Then execute the command it returns in its output
$ sudo env PATH=$PATH:/home/pi/.nvm/versions/node/v14.15.3/bin /home/pi/.nvm/versions/node/v14.15.3/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi
# Dump the process list to a file so it will be there when the Pi restarts:
$ pm2 save
```

To remove startup script, run `pm2 unstartup`.

## Development

The library is bootstrapped from [TSDX](https://github.com/formium/tsdx).

To run TSDX, use `npm start`.
This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `npm run build`.

To run tests, use `npm test`.

To run the application in development, use `node dist/index.js` and it will run in the local console.

## Precedents

`bonk` depends on, is derived from, or draws inspiration from the following libraries:

- [mattwelch/sonospowermate](https://github.com/mattwelch/sonospowermate) (formerly used this, but outgrew it when I got a second Sonos speaker)
- [svrooij/node-sonos-ts](https://github.com/svrooij/node-sonos-ts) (typed rewrite of `node-sonos` - currently a dependency for controlling Sonos)
- [sandeepmistry/node-powermate](https://github.com/sandeepmistry/node-powermate) (derived some of my PowerMate logic from here)
- [jishi/node-sonos-discovery](https://github.com/jishi/node-sonos-discovery) (for some hints about Sonos group logic)
- [happycodelucky/rocket-nuimo-node](https://github.com/happycodelucky/rocket-nuimo-node) (for pretty much all things Nuimo; happy that there's an active and up-to-date (and TypeScript-ed!) library for Nuimo)

## Meta

The name Bonk comes from the word "knob" spelled backward, because the library was originally intended to control just the Griffin PowerMate USB input knob, but it was later extended to support more devices.

by Andrew Westling, 2020-2021
