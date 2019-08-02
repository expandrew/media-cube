
"""
This is the main runner for the knob service
"""
import glob
from lib.powermate import PowerMateBase, LedEvent, MAX_BRIGHTNESS

class ShairportSyncPowermate(PowerMateBase):
  def __init__(self, path):
    super(ShairportSyncPowermate, self).__init__(path)
    self._playing = True
    self._pulsing = self._playing
    self._brightness = MAX_BRIGHTNESS

  def short_press(self):
    if self._playing:
      print('Pause')
      self._playing = False
      return LedEvent(brightness=self._brightness)
    else:
      print('Play')
      self._playing = True
      return LedEvent.pulse()

  def long_press(self):
    print('Reset')
    self._playing = False
    return LedEvent(brightness=0)

  def rotate(self, rotation):
    if rotation < 1:
      print('Volume down')
    else:
      print('Volume up')

  def push_rotate(self, rotation):
    if rotation < 1:
      print('Previous Track')
    else:
      print('Next Track')


if __name__ == '__main__':
  pm = ShairportSyncPowermate(glob.glob('/dev/input/by-id/*PowerMate*')[0])
  pm.run()
