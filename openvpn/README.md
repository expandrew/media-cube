# openvpn

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

## Static client IPs

I also added configuration to make OpenVPN assign static IPs to clients. I used the tutorial in [this GitHub issue comment](https://github.com/pivpn/pivpn/issues/257#issuecomment-327055275) - the gist is here:

Add this to `/etc/openvpn/server/server.conf`:
```
client-config-dir /etc/openvpn/ccd
```

Make the directory at `/etc/openvpn/ccd` and add files with names that match the OpenVPN client file names (ex. `ccd/AMW-iPhone-8` corresponds to `AMW-iPhone-8.ovpn`)

Make the files contain the contents below (change 10.8.0.5 to the desired address):

```
ifconfig-push 10.8.0.5 255.255.255.0
```

Also add lines like this to the `/etc/openvpn/server/ipp.txt` file:
```
AMW-iPhone-8,10.8.0.5
AMW-MacBook,10.8.0.3
```
(This is used by the `ifconfig-pool-persist` option, which seemed to be enabled by default in PiVPN's setup)

I also found that restarting the OpenVPN service didn't do the trick to start assigning the IPs, so I restarted the whole Raspberry Pi and it seemed to start assigning my clients the correct IPs from the files above.
