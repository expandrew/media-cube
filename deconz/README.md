# deCONZ

These are notes to install and set up the deCONZ application for configuring, controlling, and monitoring Zigbee devices with the [ConBee II](https://phoscon.de/en/conbee2/).

I follow the Docker installation steps in [these instructions](https://phoscon.de/en/conbee2/install#docker), but I modified them to use docker-compose.

## Installation

Set user USB access rights:

```bash
$ sudo gpasswd -a $USER dialout
$ sudo reboot # You have to reboot for this to take effect
```

Start the container

```bash
$ docker-compose up -d
```

## Backups

deCONZ has a solid backup feature, and I have a copy of my latest "good" configuration in the [`backups/`](backups/) folder.

The backups include lights, groups, scenes, switches (and actions). It seems also to include configuration beyond what Phoscon can show (so things I set up with the Hue Essentials app get included in the backup, which is great).

To restore a backup:

- Open Phoscon
- Settings > Gateway > Backup options > Load backup
- Choose the file from the `backups/` folder
