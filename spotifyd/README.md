# spotifyd

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

I also added a cron job to clear out `/cache_directory` every day because it seems to fill up and throw errors. The cron job was added like this:

```bash
sudo crontab -e

```

Add these lines to the file:
```
# Clear spotifyd cache directory daily
@daily sudo rm -rf /cache_directory
```

Then restart cron jobs:
```bash
sudo /etc/init.d/cron start
sudo /etc/init.d/cron reload
```
