# Media Cube

This is a repo of the stuff I've installed on Media Cube.

It's intended to live at `~/MediaCube` on my Raspberry Pi Model 3B+

Below is what I've set up:

### In use

- [gandi-ldns](gandi-ldns/) (dynamic DNS updater to point a subdomain to my home IP for OpenVPN)
- [knob-ts](knob-ts/) (adapter library written in TypeScript to map inputs and outputs on assorted devices)
- [openvpn](openvpn/) (OpenVPN server for my home network)
- [pi-hole](pi-hole/) (ad-blocker for my home network)

### Unbuilt

- [knob-py](knob-py/) - (adapter library written in Python, but not completed; not comfortable enough in Python, maybe will come back to this)
- [cd-player](cd-player/) (CD player to use Apple SuperDrive and Raspberry Pi's audio out to play CD audio; needs to integrate with an input device to control it)

### Retired

- ~~[shairport-sync](shairport-sync)~~ (No longer using AirPlay on Media Cube; using Sonos now)
- ~~[sonospowermate](sonospowermate/)~~ (No longer using this to glue together PowerMate and Sonos; replaced by [knob-ts](knob-ts/))
- ~~[spotifyd](spotifyd/)~~ (No longer using Spotify Connect on Media Cube; using Sonos now)
