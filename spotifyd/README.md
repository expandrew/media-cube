# spotifyd ![retired](https://img.shields.io/badge/-retired-lightgrey)

**Update 20200208:** I disabled spotifyd in favor of using the Sonos speaker and the PowerMate to control it. See [sonospowermate](../sonospowermate/) for more info. I used these commands to disable spotifyd:

```bash
sudo systemctl stop spotifyd
sudo systemctl disable spotifyd
```

---

## Installation

I installed spotifyd from the instructions on the [Spotifyd GitHub wiki](https://github.com/Spotifyd/spotifyd/wiki/Installing-on-a-Raspberry-Pi):

```bash
# Had to reinstall unzip for some reason
sudo apt-get install unzip

# Grab the spotifyd repo
cd ~/MediaCube
mkdir spotifyd && cd spotifyd # Make spotifyd directory
wget https://github.com/Spotifyd/spotifyd/releases/download/v0.2.13/spotifyd-2019-09-15-armv6-slim.zip
unzip spotifyd-2019-09-15-armv6-slim.zip # Now you have ~/MediaCube/spotifyd/spotifyd available

# Create configuration file from example
cp ~/MediaCube/spotifyd/spotifyd.conf.example ~/MediaCube/spotifyd/spotifyd.conf

# Edit configuration file to add username/password:
vi ~/MediaCube/spotifyd/spotifyd.conf # Add the credentials

# Copy service file to system
cp ~/MediaCube/spotifyd/spotifyd.service /etc/systemd/system/spotifyd.service

# Start the service
sudo systemctl daemon-reload
sudo systemctl enable spotifyd
sudo systemctl start spotifyd

# Connect to Media Cube on Spotify Connect and music should be playing
```
