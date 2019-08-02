
"""
This is the main runner for the knob service
"""

from time import sleep

try:
    while True:
        print "Hello World"
        sleep(5)
except KeyboardInterrupt, e:
    print "Stopping..."
