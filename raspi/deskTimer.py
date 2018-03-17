from threading import Timer

class DeskTimer(object):
    current_timer = None

    def start(self, time, callback, *args):
        self.current_timer = Timer(time, callback, args)
        self.current_timer.start()

    def stop(self):
        if  self.current_timer != None:
            self.current_timer.cancel()
