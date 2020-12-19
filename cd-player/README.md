# cd-player ![unbuilt](https://img.shields.io/badge/-unbuilt-red)

![images/devices.png](images/devices.png)

This is a placeholder for scripts, notes, and hacks to make my Raspberry Pi play CDs from an [Apple USB SuperDrive](https://www.apple.com/shop/product/MD564LL/A/apple-usb-superdrive), with a [Griffin PowerMate](https://griffintechnology.com/powermate-usb-classic-aluminum) USB knob to control playback.

## Concept

> This is all so I can play CDs with my [Media Cube](https://andrewwestling.com/posts/media-cube).

![](images/media-cube-cd-player.png)

- (Apple USB SuperDrive is connected to Raspberry Pi USB)
- (Griffin PowerMate is connected to Raspberry Pi USB)
- (Tivoli Audio Model One is connected to Raspberry Pi 3.5mm Audio Out)
- Put CD in Apple USB SuperDrive
- Music starts playing automatically through Raspberry Pi 3.5mm Audio Out
- Use Griffin PowerMate to pause/play (press), change track (press+turn), and eject disc (long press)

## Parts

### SuperDrive Initializer

Apple's USB SuperDrive's firmware has a built-in "lock" on it that requires the host machine to send a "magic" byte sequence to the drive when it's connected in order for it to be recognized and used.

This is detailed by Christian Moser [here](https://christianmoser.me/use-apples-usb-superdrive-with-linux/)

The gist is:

```bash
# Install sg
sudo apt-get install sg3-utils
# Send this byte sequence to the drive using SCSI Generic driver packages
sg_raw /dev/sr0 EA 00 00 00 00 00 01
```

### Audio Playback

- [Mplayer: Play Audio CD Using Linux Command Line](https://www.cyberciti.biz/faq/linux-unix-mplayer-playing-audio-dvd-cd-using-bash-shell/)

### Raspberry Pi Sound Configuration

- [ALSA, `amixer`, and `alsa-utils`](http://blog.scphillips.com/posts/2013/01/sound-configuration-on-raspberry-pi-with-alsa/)
- [Setting Volume for 3.5mm jack](https://www.raspberrypi.org/forums/viewtopic.php?t=14966)

**Volume Commands**

```bash
# Increase volume by 5%
alias volu='sudo amixer set PCM -- $[$(amixer get PCM|grep -o [0-9]*%|sed 's/%//')+5]%'
# Decrease volume by 5%
alias vold='sudo amixer set PCM -- $[$(amixer get PCM|grep -o [0-9]*%|sed 's/%//')-5]%'
```

### PowerMate Drivers

- [bethebunny/powermate](https://github.com/bethebunny/powermate) - Small Python framework for scripting interactions with Griffin PowerMate

---

## Precedents

- [Bluetooth CD Player with RPi 3](https://www.heinbockel.eu/2016/12/09/bluetooth-cd-player-with-raspberry-pi-3/)
- [Reddit: Project idea: Raspberry Pi + CD Reader >= CD player?](https://www.reddit.com/r/raspberry_pi/comments/35yu0u/project_idea_raspberry_pi_cd_reader_cd_player/)
- [GitHub `ivankrato/raspberry-pi-cdplayer`](https://github.com/ivankrato/raspberry-pi-cdplayer)
- [Raspberry Pi, Jivelite, and Griffin PowerMate](https://forums.slimdevices.com/showthread.php?103051-Raspberry-PI-Jivelite-and-a-Griffin-Powermate)
