# Setup

``` sh
pip install adafruit-ampy esptool
```

Get firmware from http://micropython.org/download#esp8266.
Flash with

``` sh
esptool.py --port /dev/ttyUSB0 erase_flash
esptool.py --port /dev/ttyUSB0 --baud 460800 write_flash --flash_size=detect 0 <firmwarefile>.bin
```

Use any serial terminal emulator (minicom, picocom, miniterm.py, dterm) to
connect to the board, you should get a python REPL.

# Uploading files to the board

First, disable printing of debug symbols from the ESP:

``` python
import esp
esp.osdebug(None)
```


To upload http.py

``` sh
ampy --port /dev/ttyUSB0 put http.py 
```


## More info
https://learn.adafruit.com/micropython-basics-load-files-and-run-code/overview
