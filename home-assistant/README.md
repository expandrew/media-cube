# Home Assistant

These are my notes for installing and configuring the [Home Assistant](https://www.home-assistant.io/) automation framework on my Pi.

## Installation

I use the "Container" installation method from [their instructions](https://www.home-assistant.io/installation/).

Install dependencies:

```bash
$ sudo apt-get install libffi-dev # pip3 needs this
$ sudo apt install python3-pip # Docker Compose down below will need this
```

Install Docker and Docker Compose:

```bash
$ curl -sSL https://get.docker.com | sh # Install Docker
$ sudo pip3 install docker-compose # Install Docker Compose
```

Start Home Assistant container with Docker Compose:

```bash
docker-compose up -d
```

## deCONZ

I connect all the devices to a ConBee II gateway and manage it with deCONZ running on the Pi.

To set things up with deCONZ, I use the [Phoscon app](https://phoscon.de/app) in the browser. It finds the gateway on my local network and can read/configure the devices.

Using the [Hue Essentials app](https://www.hueessentials.com/) on the phone also works to set things up with deCONZ.
