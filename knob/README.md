# Knob

Knob handles input/output for Media Cube

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

| Input                               | Command |
|-------------------------------------|------------|
| press                               | play/pause |
| rotate clockwise                    | volume up |
| rotate counter clockwise            | volume down |
| press and rotate clockwise          | next track |
| press and rotate counter clockwise  | previous track |
| long press                          | disconnect/eject/reset |
| double press                        | "secondary mode" |

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

```

Now it's time to figure out how to use it in a Python script

```bash
# ... Yeah
```

But also how the hell do you run a Python script in the background so it's always listening for inputs (and firing outputs)?

```bash
# Write a service definition: knob.service
# TODO: This is still in progress

# Copy the service definition into the right place
cp knob.service /lib/systemd/system/

# Start the service
sudo servicectl enable knob.service
```
