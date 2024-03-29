
"""
This is the main runner for the knob service
"""
import os
import glob
import alsaaudio
import spotipy
import spotipy.util as util
from lib.powermate import PowerMateBase, LedEvent, MAX_BRIGHTNESS

SPOTIFY_CLIENT_ID=os.environ.get('SPOTIFY_CLIENT_ID', None)
SPOTIFY_CLIENT_SECRET=os.environ.get('SPOTIFY_CLIENT_SECRET', None)
SPOTIFY_REDIRECT_URI=os.environ.get('SPOTIFY_REDIRECT_URI', 'http://localhost/')
SPOTIFY_USER_NAME=os.environ.get('SPOTIFY_USER_NAME')


class Knob(PowerMateBase):
  def __init__(self, path):
    super(Knob, self).__init__(path)
    print('Thing\'s on')
    self._playing = False
    self._volume = media_cube.get('volume_percent', 75)
    LedEvent(brightness=128)

  def get_player_state(self):
    self._playing = not self._playing

  def short_press(self):
    self.get_player_state()

    if self._playing:
      print('Pause')
      return LedEvent(brightness=0)
    else:
      print('Play')
      return LedEvent(brightness=128)

  def long_press(self):
    print('Reset')
    return LedEvent(brightness=0)


  def rotate(self, rotation):
    if rotation < 1:
      print('Volume Down')
      self._volume -= 1
    else:
      print('Volume Up')
      self._volume += 1

    # check to make sure volume is between 0-100
    if self._volume >= 100:
      self._volume = 100
      print('Volume Max')
    elif self._volume <= 0:
      self._volume = 0
      print('Volume Min')

    mixer.setvolume(self._volume)

    return print('Volume is now {}'.format(self._volume))


  def push_rotate(self, rotation):
    if rotation < 1:
      print('Previous')
    else:
      print('Next')


if __name__ == '__main__':
  # Find PCM audio (for setting volume)
  mixer = alsaaudio.Mixer('PCM')

  if not mixer:
    raise Exception('No PCM audio interface found... we gotta stop')

  # Get Spotify  authentication token
  spotify_auth_token = util.prompt_for_user_token(
      scope='user-read-playback-state user-modify-playback-state',
      username=SPOTIFY_USER_NAME,
      client_id=SPOTIFY_CLIENT_ID,
      client_secret=SPOTIFY_CLIENT_SECRET,
      redirect_uri=SPOTIFY_REDIRECT_URI)

  if not spotify_auth_token:
    raise Exception('Spotify authentication token wasn\'t available... we gotta stop')

  # Find MediaCube in Spotify Connect devices
  sp = spotipy.Spotify(auth=spotify_auth_token)
  devices = sp.devices().get('devices')
  filtered = filter(lambda device: device.get(u'name') == u'MediaCube', devices) # Returns a list of objects (hopefully only one): [{}]
  media_cube = next(iter(filtered), None) # Gets first item in list or None if doesn't exist

  if not media_cube:
    raise Exception('MediaCube wasn\'t found in Spotify Connect... we gotta stop')

  # Find PowerMate
  powermate = Knob(glob.glob('/dev/input/by-id/*PowerMate*')[0])

  if not powermate:
    raise Exception('PowerMate wasn\'t found in devices... we gotta stop')

  print('Everything\'s good, here we go...')
  powermate.run()
