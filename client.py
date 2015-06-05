from socketIO_client import SocketIO, BaseNamespace

# Standard events
class Namespace(BaseNamespace):
    def on_connect(self):
        print('[Connection Established]')

# Custom events
def on_message(self, *args):
    print(self)

socketIO = SocketIO('localhost', 1337, Namespace)
socketIO.on('heartbeat', on_message)
socketIO.emit('heartbeat', 'ping')
socketIO.wait(seconds=1)