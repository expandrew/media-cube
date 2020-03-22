#!/bin/sh

case "$1" in
start)
exec forever -a start -a "-p /home/pi/.forever" -a "--sourceDir /home/pi/MediaCube/sonospowermate/" -a "/home/pi/MediaCube/sonospowermate/forever.json"
;;
stop)
exec forever -a stopall
;;
*)

echo "Usage: ./forever.sh {start|stop}"
exit 1
;;
esac
exit 0
