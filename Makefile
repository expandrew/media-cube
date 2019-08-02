dev:
	python knob/knob.py

start:
	sudo systemctl start knob.service

stop:
	sudo systemctl stop knob.service

install:
	sudo cp knob/knob.service /etc/systemd/system/

uninstall:
	sudo rm /etc/systemd/system/knob.service
