# Knob ![unbuilt](https://img.shields.io/badge/-unbuilt-red)

Knob handles input/output for Media Cube

# Getting started

```bash
$ make install    # sets up the service
$ make start      # starts the knob service so commands will work
$ make stop       # stops the knob service
$ make uninstall  # you get it
```

# Notes

## Input devices

**Griffin PowerMate**

- permanent; built into Media Cube
- input from knob/button
- output via dimmable blue LED

**Nuimo**

- bluetooth; can be moved around
- input from knob, button, swipe/tap, fly (but prob too touchy)
- output via 9x9 LED matrix

## External applications

- **Shairport Sync**: playback controls for AirPlay audio
- **Spotify**: shuffle playback for specified playlist(s)
- **CD player**: basic playback and eject
- **pyradio**: WNYC stream

## General input/command mappings

| Input                              | Command                |
| ---------------------------------- | ---------------------- |
| press                              | play/pause             |
| rotate clockwise                   | volume up              |
| rotate counter clockwise           | volume down            |
| press and rotate clockwise         | next track             |
| press and rotate counter clockwise | previous track         |
| long press                         | disconnect/eject/reset |
| double press                       | "secondary mode"       |

## Development Log

What I did to install the Nuimo drivers on Raspberry Pi:

```bash
# I think Bluetooth was installed already but
sudo apt-get install --no-install-recommends bluetooth
# Then check if it worked
bluetoothd --version
# Then turn on Bluetooth if it isn't already
echo "power on" | sudo bluetoothctl
# You can do other stuff with bluetoothctl:
sudo bluetoothctl
# `power on` enables the adapter
# `scan on` starts scanning and lists MAC addresses
# `connect AA:BB:CC:DD:EE:FF` connects to Nuimo with specified MAC address
# `exit` quits the interactive mode thing

####
# Next, make sure Python is installed right on Raspbian (this tripped me up)
# I can't remember what I had to do but ... Googling
# (I feel like it was something like pip3 was broken so `sudo apt-get install python3-pip`)

# Next, install Nuimo Python stuff
sudo pip3 install nuimo
sudo apt-get install python3-dbus
# Then run the Nuimo control script thing
sudo nuimoctl --discover # finds Nuimos connected, copy the MAC jk it's d1:b3:e3:66:75:61
sudo nuimoctl --connect d1:b3:e3:66:75:61 # paste MAC
# All the above is just for fun to make sure it's working so now if stuff shows up it's good


####
# Set up PowerMate so we can read events (from https://github.com/bethebunny/powermate#setup)
sudo groupadd input
sudo usermod -a -G input "$USER"
echo 'KERNEL=="event*", NAME="input/%k", MODE="660", GROUP="input"' | sudo tee -a /etc/udev/rules.d/99-input.rules
sudo reboot
```
