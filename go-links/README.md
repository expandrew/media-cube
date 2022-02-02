# go-links

I run some tricks on my local network to make shortcuts to services I use.

I created "go links" so I don't have to remember what IPs, ports, and paths each of my services runs on.

| Path                              | Destination                                   |
| --------------------------------- | --------------------------------------------- |
| `go.expandrew.com/home-assistant` | [Home Assistant dashboard](../home-assistant) |
| `go.expandrew.com/modem`          | Zoom 5341J cable modem                        |
| `go.expandrew.com/phoscon`        | [Phoscon for my Zigbee lights](../deconz)     |
| `go.expandrew.com/photos`         | Synology Photos on AMW-NAS                    |
| `go.expandrew.com/pi-hole`        | [Pi-hole admin console](../pi-hole)           |
| `go.expandrew.com/nas`            | Synology DSM on AMW-NAS                       |
| `go.expandrew.com/syncthing-mba`  | Syncthing UI on AMW-MBA                       |
| `go.expandrew.com/syncthing-nas`  | Syncthing UI on AMW-NAS                       |

## Setup

To set everything up:

1. [Configure dnsmasq on Pi-hole](#dnsmasq)
1. [Change Pi-hole's web port](#pi-hole-web-port)
1. [Set up and start nginx service](#nginx)

### dnsmasq

Copy the dnsmasq configuration files and restart Pi-hole DNS:

```bash
sudo cp ~/MediaCube/go-links/dnsmasq/internal.conf /etc/dnsmasq.d/internal.conf
sudo cp ~/MediaCube/go-links/dnsmasq/internal.list /etc/pihole/internal.list
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

⚠️ Note: this port change will apparently get wiped out anytime Pi-hole gets an update, so I should find a better way to do this (or just remember to re-run this when I update Pi-hole)

### nginx

Install nginx with these steps:

```bash
sudo apt-get update
sudo apt-get install nginx
```

Install and configure `certbot` for SSL:

```bash
sudo apt install python-certbot-nginx
sudo certbot --domain go.expandrew.com --manual --preferred-challenges dns certonly
# Open Gandi DNS records and add the TXT record it tells you to add
```

Configure nginx:

```bash
# Replace the nginx configuration
sudo cp -a ~/MediaCube/go-links/nginx/nginxconfig.io/. /etc/nginx/nginxconfig.io
sudo cp ~/MediaCube/go-links/nginx/nginx.conf /etc/nginx/nginx.conf
```

Restart nginx:

```bash
sudo systemctl restart nginx
```

nginx should now be proxying the shortcut paths to the destinations listed at the top of this README.

There's a little [index page](nginx/index.html) available on the internal network at [`http://go.expandrew.com`](http://go.expandrew.com) that has a list of the available paths

---

## Meta

- `go.` doesn't work on the public internet, only on my internal network.
- `go.` also stands for "Grown Ocean," the name of my local network.
- This article helped me a lot with understanding dnsmasq: [Internal Domains with DNSMasq and Pi-Hole](https://dev.to/stjohnjohnson/internal-domains-with-dnsmasq-and-pi-hole-4cof)
- This article helped me succinctly change the Pi-hole port: [pi-hole: change default web admin port](https://jdsworld.com/tech-support/pi-hole-dns-change-default-web-port/)
- This article helped me use `certbot`: [Update: Using Free Let’s Encrypt SSL/TLS Certificates with NGINX](https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/)
- This article helped me set up `certbot` to use DNS TXT records instead of HTTP: [How to use Let's Encrypt DNS challenge validation?](https://serverfault.com/questions/750902/how-to-use-lets-encrypt-dns-challenge-validation)
