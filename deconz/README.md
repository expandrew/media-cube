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
