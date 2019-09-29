# Media Cube

This is a repo of the stuff I've installed on Media Cube.

It's intended to live at ~/MediaCube on my Raspberry Pi Model 3B+

Right now it has:
- pi-hole
- spotifyd
- openvpn
- gandi-ldns

## pi-hole
I installed pi-hole from the instructions on [pi-hole.net](https://pi-hole.net):

```bash
curl -sSL https://install.pi-hole.net | bash
```
The settings files are backed up in `~/MediaCube/pi-hole`. This can be re-imported in [Teleporter](http://10.0.1.10/admin/settings.php?tab=teleporter).

Pi-hole is running a DHCP server on my network so the AirPort Express DHCP is effectively disabled using the instructions in [this thread](https://discussions.apple.com/thread/7463900)

I added the Pi's MAC IDs (ethernet and Wi-Fi) as the two reservations at 10.0.1.10 and 10.0.1.11 so that the AirPort Express would not assign any other IPs to clients. The Pi takes care of DHCP for the rest of the clients on the network. I have IPs/host names set per MAC ID of each device on the network in Pi-hole's [DHCP settings](http://10.0.1.10/admin/settings.php?tab=piholedhcp)

## openvpn
This was set up with hints from the [Pi-Hole OpenVPN Installation](https://docs.pi-hole.net/guides/vpn/installation/) page

I ran:

```bash
wget https://git.io/vpn -O openvpn-install.sh
chmod 755 openvpn-install.sh
./openvpn-install.sh
```

To create keys, you run `./openvpn-install.sh` again and use the CLI

I moved the keys to the `openvpn/keys` directory (gitignored), then used `scp` to copy to my remote devices:

```bash
scp pi@10.0.1.10:/home/pi/MediaCube/openvpn/keys/<KEY NAME>.ovpn ~/Desktop
```

Then AirDrop them to the devices where they will be used, etc


## gandi-ldns
gandi-ldns is the effective "dynamic DNS" updater for [o.andrewwestling.com] subdomain, used for OpenVPN

It runs on a cron job, which was set up like this:
```bash
sudo crontab -e

```

Add these lines to the file:
```
@reboot python3 /home/pi/MediaCube/gandi-ldns/gandi-ldns.py &
*/15 * * * * python3 /home/pi/MediaCube/gandi-ldns/gandi-ldns.py
```

Then restart cron jobs:
```bash
sudo /etc/init.d/cron start
sudo /etc/init.d/cron reload
```

  
