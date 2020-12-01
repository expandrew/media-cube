# sonos-powermate

This is my custom library to run my Sonos setup with a Griffin PowerMate from a Raspberry Pi.

It depends on, is derived from, or draws inspiration from the following libraries:

- [mattwelch/sonospowermate](https://github.com/mattwelch/sonospowermate) (formerly used this, but outgrew it when I got a second Sonos speaker)
- [svrooij/node-sonos-ts](https://github.com/svrooij/node-sonos-ts) (typed rewrite of `node-sonos` - currently a dependency for controlling Sonos)
- [sandeepmistry/node-powermate](https://github.com/sandeepmistry/node-powermate) (derived some of my PowerMate logic from here)
- [jishi/node-sonos-discovery](https://github.com/jishi/node-sonos-discovery) (for some hints about Sonos group logic)

## Setup

Install Node.js `v14.15.1` on the Raspberry Pi:

```bash
# If nvm isn't installed, install it:
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
$ exec bash

# Install Node.js v14.15.1
$ nvm install 14.15.1
```

Install libusb on the Raspberry Pi:

```bash
$ sudo apt-get install libusb-1.0-0-dev
```

Set up rules for PowerMate USB:

```bash
$ sudo vi /etc/udev/rules.d/95-powermate.rules

# Paste the following:
SUBSYSTEM=="usb", ATTRS{idVendor}=="077d", ATTRS{idProduct}=="0410", SYMLINK+="powermate", MODE="660", GROUP="input"

# Save and exit, etc.
```

(Unplug/re-plug the PowerMate in USB if it's already plugged in)

Run `npm install` in this direcory to bring in the dependencies.

<!-- TODO: Add docs for running script indefinitely via `pm2` -->

## Development

The library is bootstrapped from [TSDX](https://github.com/formium/tsdx).

To run TSDX, use `npm start`.
This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `npm run build`.

To run tests, use `npm test`.

To run the application in development, use `node dist/index.js` and it will run in the local console.
