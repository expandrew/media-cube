# Network

I run some tricks on my local network to make shortcuts to services I use.

This is so I don't have to remember what IPs, ports, and paths each of my services runs on.

## Setup

To set everything up:

1. [Forward VPN port on router](#router)
1. [Configure dnsmasq on Pi-hole](#dnsmasq)
1. [Change Pi-hole's web port](#pi-hole-web-port)
1. [Set up and start nginx service](#nginx)

### Router

Make sure [dynamic DNS](../gandi-ldns) is set up to point `go.expandrew.com` to my home IP

Next, on the router, manually forward port 1194 UDP to the [OpenVPN server](../openvpn). Finish the other setup steps for OpenVPN on that README, too.

Once connected, the VPN clients should get their DNS from the Pi-hole.

### dnsmasq

Copy the dnsmasq configuration files and restart Pihole DNS:

```bash
sudo cp ~/MediaCube/network/dnsmasq/internal.conf /etc/dnsmasq.d/internal.conf
sudo cp ~/MediaCube/network/dnsmasq/internal.list /etc/pihole/internal.list
pihole restartdns
```

Verify that the configuration worked:

```bash
dig @127.0.0.1 go.expandrew.com +short
10.0.1.10
```

### Pi-hole web port

Pi-hole runs on port 80 by default, but we want nginx on that port.

Update Pi-hole to use port 8090 instead:

```bash
sudo cp /etc/lighttpd/lighttpd.conf /etc/lighttpd/lighttpd.conf.backup
sudo sed -ie "s/= 80/= 8090/g" /etc/lighttpd/lighttpd.conf
sudo /etc/init.d/lighttpd restart
```

### nginx

Install nginx with these steps:

```bash
sudo apt-get update
sudo apt-get install nginx
```

Configure nginx:

```bash
# Replace the nginx configuration
sudo cp -a ~/MediaCube/network/nginx/nginxconfig.io/. /etc/nginx/nginxconfig.io
sudo cp ~/MediaCube/network/nginx/nginx.conf /etc/nginx/nginx.conf
```

Restart nginx:

```bash
sudo systemctl restart nginx
```

nginx should now be proxying these paths to the destinations below:

| Path                             | Destination                               |
| -------------------------------- | ----------------------------------------- |
| `go.expandrew.com/modem`         | Zoom 5341J cable modem                    |
| `go.expandrew.com/phoscon`       | [Phoscon for my ZigBee lights](../deconz) |
| `go.expandrew.com/photos`        | Synology Photos on AMW-NAS                |
| `go.expandrew.com/pihole`        | Pi-hole admin console                     |
| `go.expandrew.com/nas`           | Synology DSM on AMW-NAS                   |
| `go.expandrew.com/syncthing-mba` | Syncthing UI on AMW-MBA                   |
| `go.expandrew.com/syncthing-nas` | Syncthing UI on AMW-NAS                   |

There's a little [index page](nginx/index.html) available on the internal network at [`http://go.expandrew.com`](http://go.expandrew.com) that has a list of the available paths

---

## Meta

- Anything that is a subdomain of `go.` is mapped to a local service. These subdomains don't work on the public internet.
- `go.` also stands for "Grown Ocean," the name of my local network.
- This article helped me a lot with understanding dnsmasq: [Internal Domains with DNSMasq and Pi-Hole](https://dev.to/stjohnjohnson/internal-domains-with-dnsmasq-and-pi-hole-4cof)
- This article helped me succinctly change the Pi-hole port: [pi-hole: change default web admin port](https://jdsworld.com/tech-support/pi-hole-dns-change-default-web-port/)
