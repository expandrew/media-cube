dev:
	python3 knob.py

start:
	sudo systemctl start knob.service

stop:
	sudo systemctl stop knob.service

install:
	sudo cp knob.service /etc/systemd/system/
	sudo pip3 install -r requirements.txt

uninstall:
	sudo rm /etc/systemd/system/knob.service
