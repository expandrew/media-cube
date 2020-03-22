# sonospowermate

This is a library that is derived from [mattwelch/sonospowermate](https://github.com/mattwelch/sonospowermate) for controlling a Sonos speaker group with a Griffin PowerMate connected to a Rasberry Pi.

Below, the content is derived from his README and a [post on his website](https://mattwelch.io/controlling-a-sonos-with-the-griffin-powermate/), with a few additions and changes that I made.

## Setup

Install **Node v0.10.26** on the Raspberry Pi:

```shell
# Install nvm
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash

# Restart shell
$ exec bash

# Install Node 0.10.26 because there are bunch of nonsense dependency errors in later versions that prevent this thing from compiling correctly:
$ nvm install 0.10.26
```

Install libusb:

```shell
$ sudo apt-get install libusb-1.0-0-dev
```

Set up rules for PowerMate USB:

```shell
$ sudo vi /etc/udev/rules.d/95-powermate.rules

# Paste the following:
SUBSYSTEM=="usb", ATTRS{idVendor}=="077d", ATTRS{idProduct}=="0410", SYMLINK+="powermate", MODE="660", GROUP="input"

# Save and exit, etc.
```
(Unplug/re-plug the PowerMate in USB if it's already plugged in)

Run `npm install` in this directory to bring in the dependencies.

Edit the `sonospowermate.js` file, look for the config variable `PLAYER_NAME`, and replace it with the name of the Sonos zone you plan to control with the Powermate.

Copy the `.env.example` file to `.env` and replace the `VOICERSS_API_KEY` with your access key from [voicerss.com](http://www.voicerss.org/login.aspx).

Set up `forever` to keep the thing running:

```shell
$ npm install forever@0.15.3 -g
```

Set up cronjob to start `forever` on boot:

```shell
$ sudo crontab -e

# Paste the following:
@reboot /home/pi/MediaCube/sonospowermate/forever.sh start
# FIXME: This doesn't work properly but the idea is this 👆

# Save and exit, etc.
```

Then things should be working!

## Use
The blue LED ring on the Powermate will pulse while the app is learning about your Sonos topology, and will turn off (or on, if your zone is currently playing) when discovery is complete, and the system is ready for use.
### Commands
#### Zone playing
- **Turn right**: increase group volume
- **Turn left**: decrease group volume
- **Push turn right**: increase zone volume (that is, the volume of the single specified zone, even if it's in a group)
- **Push turn left**: decrease zone volume
- **Single press**: Stop Sonos
- **Double press**: Next track
- **Long press**: Previous track

#### Zone not playing, and not in favorites mode
- **Single press**: Start Sonos
- **Double press**: Enter favorites mode

#### Zone not playing, and in favorites mode
- **Turn right**: Go to the next favorite
- **Turn left**: Go to the previous favorite
- **Single press**: Play the current favorite
- **Double press**: Exit favorites mode


## Notes
This was developed and deployed on a Raspbian Raspberry Pi system. There are a couple steps necessary to get it running in this context. See this [blog post](http://mattwel.ch/controlling-a-sonos-with-the-griffin-powermate "PowerMate and Sonos") for more thorough instrucitons.
