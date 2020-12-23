# knob-ts

Custom adapter library to map inputs and outputs for Media Cube

It will map the following inputs:

- [x] Griffin PowerMate
- [ ] Senic Nuimo

to the following outputs:

- [x] Sonos
- [ ] Hue lights
- [ ] `media-cube/cd-player`

## Setup

Install Node.js `v14.15.3` on the Raspberry Pi:

```bash
# If nvm isn't installed, install it:
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
$ exec bash

# Install Node.js v14.15.3
$ nvm install 14.15.3
```

<!-- TODO: Add docs for setting up PowerMate drivers with Raspbian to assign hidraw drivers via udev when connected -->

Install and start the app with `pm2` on the Raspberry Pi

```bash
# Install pm2 globally
$ npm install -g pm2

# Start the app with pm2
$ npm run pm2:start
```

## Development

The library is bootstrapped from [TSDX](https://github.com/formium/tsdx).

To run TSDX, use `npm start`.
This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `npm run build`.

To run tests, use `npm test`.

To run the application in development, use `node dist/index.js` and it will run in the local console.

## Precedents

`knob-ts` depends on, is derived from, or draws inspiration from the following libraries:

- [mattwelch/sonospowermate](https://github.com/mattwelch/sonospowermate) (formerly used this, but outgrew it when I got a second Sonos speaker)
- [svrooij/node-sonos-ts](https://github.com/svrooij/node-sonos-ts) (typed rewrite of `node-sonos` - currently a dependency for controlling Sonos)
- [sandeepmistry/node-powermate](https://github.com/sandeepmistry/node-powermate) (derived some of my PowerMate logic from here)
- [jishi/node-sonos-discovery](https://github.com/jishi/node-sonos-discovery) (for some hints about Sonos group logic)

## Meta

by Andrew Westling, 2020
