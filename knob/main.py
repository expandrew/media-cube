
"""
This is the main runner for the knob service
"""
import glob
from powermate.powermate import PowerMateBase, LedEvent, MAX_BRIGHTNESS

class ExamplePowerMate(PowerMateBase):
  def __init__(self, path):
    super(ExamplePowerMate, self).__init__(path)
    self._pulsing = False
    self._brightness = MAX_BRIGHTNESS

  def short_press(self):
    print('Short press!')
    self._pulsing = not self._pulsing
    print(self._pulsing)
    if self._pulsing:
      return LedEvent.pulse()
    else:
      return LedEvent(brightness=self._brightness)

  def long_press(self):
    print('Long press!')

  def rotate(self, rotation):
    print('Rotate {}!'.format(rotation))
    self._brightness = max(0, min(MAX_BRIGHTNESS, self._brightness + rotation))
    self._pulsing = False
    return LedEvent(brightness=self._brightness)

  def push_rotate(self, rotation):
    print('Push rotate {}!'.format(rotation))

if __name__ == '__main__':
  pm = ExamplePowerMate(glob.glob('/dev/input/by-id/*PowerMate*')[0])
  pm.run()
