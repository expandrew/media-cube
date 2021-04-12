# deCONZ

These are notes to install and set up the deCONZ application for configuring, controlling, and monitoring Zigbee devices with the [ConBee II](https://phoscon.de/en/conbee2/).

## Installation

I followed the Docker installation steps in [these instructions](https://phoscon.de/en/conbee2/install#docker), but I modified them to use docker-compose.

Set user USB access rights:

```bash
$ sudo gpasswd -a $USER dialout
$ sudo reboot # You have to reboot for this to take effect
```

Start the container

```bash
$ docker-compose up -d
```

## Setup

To set things up with deCONZ, I use the [Phoscon app](https://phoscon.de/app) in the browser. It finds the gateway on my local network and can read/configure the devices.

Running the `docker-compose up -d` command above will run Phoscon on port 8000, so that's where to start.

I used Phoscon in the web browser to set up the ConBee II bridge and credentials, then I opened the [Hue Essentials](https://www.hueessentials.com/) app on my iPhone and connected to the bridge to configure the lights/scenes/switches. Hue Essentials has more configuration for switches and scenes, so I prefer using it instead of Phoscon for that part.

## Backups

deCONZ has a solid backup feature, and I have a copy of my latest "good" configuration in the [`backups/`](backups/) folder.

The backups include lights, groups, scenes, switches (and actions). It seems also to include configuration beyond what Phoscon can show (so things I set up with the Hue Essentials app get included in the backup, which is great).

To restore a backup:

- Open Phoscon
- Settings > Gateway > Backup options > Load backup
- Choose the file from the `backups/` folder
