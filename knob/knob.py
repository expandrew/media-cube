
"""
This is the main runner for the knob service
"""
import glob
from pydbus import SystemBus
from lib.powermate import PowerMateBase, LedEvent, MAX_BRIGHTNESS

class ShairportSyncPowermate(PowerMateBase):
  def __init__(self, path):
    super(ShairportSyncPowermate, self).__init__(path)
    self._playing = bus.PlayerState == 'Playing'
    self._pulsing = self._playing
    self._brightness = MAX_BRIGHTNESS

  def get_player_state(self):
    ps = bus.PlayerState
    self._playing = ps == 'Playing'
    return ps

  def short_press(self):
    ps = self.get_player_state()

    if ps == 'Playing':
      bus.Pause()
    else:
      bus.Play()
    print(ps)

  # def long_press(self):
  #   print('Reset')
  #   self._playing = bus.PlayerState
  #   return LedEvent(brightness=0)

  def rotate(self, rotation):
    if rotation < 1:
      # bus.VolumeDown()
      print('Volume Down', rotation)
    else:
      # bus.VolumeUp()
      print('Volume Up', rotation)

  def push_rotate(self, rotation):
    if rotation < 1:
      # bus.Previous()
      print('Previous', rotation)
    else:
      # bus.Next()
      print('Next', rotation)


if __name__ == '__main__':
  bus = SystemBus().get('org.gnome.ShairportSync')
  if not bus:
    raise Exception('No shairport-sync bus was found... we gotta stop')

  pm = ShairportSyncPowermate(glob.glob('/dev/input/by-id/*PowerMate*')[0])
  pm.run()
