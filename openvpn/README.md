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
