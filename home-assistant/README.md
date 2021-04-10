# Home Assistant

These are my notes for installing and configuring the [Home Assistant](https://www.home-assistant.io/) automation framework on my Pi.

## Installation

I use the "Container" installation method from [their instructions](https://www.home-assistant.io/installation/).

Install dependencies:

```bash
$ curl -sSL https://get.docker.com | sh # Install Docker
$ sudo apt install python3-pip # Install pip3 to install Docker Compose
$ sudo pip3 install docker-compose # Install Docker Compose
```

Start Home Assistant container with Docker Compose:

```bash
docker-compose up -d
```
