"""
Input: Commands

This is where we handle input from Nuimo and PowerMate

Translates the raw signals from the devices into "commands"
(disregard noise, debounce extra inputs, etc)

Command definitions for:
- "press"
- "long press"
- "double press"
- "rotate clockwise"
- "rotate counter clockwise"
- "press and rotate clockwise"
- "press and rotate counter clockwise"
- "swipe left/right/up/down" (Nuimo only)
- "tap left/right/bottom" (Nuimo only)
"""

def get_gesture_event ():
  # this is where the raw gesture event goes from the device
  # this function processes the event, then calls the correct output below
  pass

def press ():
  return (u'press')

def long_press ():
  return (u'long_press')

def double_press ():
  return (u'double_press')

def rotate_clockwise ():
  return (u'rotate_clockwise')

def rotate_counter_clockwise ():
  return (u'rotate_counter_clockwise')

def press_and_rotate_clockwise ():
  return (u'press_and_rotate_clockwise')

def press_and_rotate_counter_clockwise ():
  return (u'press_and_rotate_counter_clockwise')

# Nuimo only
def swipe_left ():
  return (u'swipe_left')

# Nuimo only
def swipe_right ():
  return (u'swipe_right')

# Nuimo only
def swipe_down ():
  return (u'swipe_down')

# Nuimo only
def swipe_up ():
  return (u'swipe_up')

# Nuimo only
def touch_left ():
  return (u'touch_left')

# Nuimo only
def touch_right ():
  return (u'touch_right')

# Nuimo only
def touch_bottom ():
  return (u'touch_bottom')
