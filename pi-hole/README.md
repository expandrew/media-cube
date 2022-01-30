# pi-hole

I installed pi-hole from the instructions on [pi-hole.net](https://pi-hole.net):

```bash
curl -sSL https://install.pi-hole.net | bash
```

The settings files are backed up in `~/MediaCube/pi-hole`. This can be re-imported in [Teleporter](http://10.0.1.10/admin/settings.php?tab=teleporter).

Pi-hole is running a DHCP server on my network so the AirPort Express DHCP is effectively disabled using the instructions in [this thread](https://discussions.apple.com/thread/7463900)

I added the Pi's MAC IDs (ethernet and Wi-Fi) as the two reservations at 10.0.1.10 and 10.0.1.11 so that the AirPort Express would not assign any other IPs to clients. The Pi takes care of DHCP for the rest of the clients on the network. I have IPs/host names set per MAC ID of each device on the network in Pi-hole's [DHCP settings](http://10.0.1.10/admin/settings.php?tab=piholedhcp)

I also use custom dnsmasq configuration to point some subdomains of `go.expandrew.com` to specific IPs on my network. This is referenced in my [network](../network) setup steps, and the configuration files are available in the [dnsmasq folder](../network/dnsmasq).
