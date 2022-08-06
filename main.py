
from starlette.exceptions import ExceptionMiddleware
from starlette.responses import Response
import asyncio
import uuid
from collections import namedtuple, deque
from dataclasses import dataclass
from static import static_files
from starlette.websockets import WebSocket


async def websock(scope, receive, send):
    assert scope['type'] == "websocket"
    websocket = WebSocket(scope=scope, receive=receive, send=send)
    await websocket.accept()
    await websocket.send_text('Hello, world!')
    await websocket.close()

clients_connected = {}
@dataclass
class HTTPClient:
    """Class for keeping track of recently connected http clients"""
    ident: uuid.UUID
    host: str
    port: int
    scope: dict
    agent: str
    def __init__(self, scope):
        self.ident = uuid.uuid4()
        self.host = scope['client'][0]
        self.port = scope['client'][1]
        self.scope = scope
        self.agent = dict(scope['headers'])[b'user-agent']

async def http(scope, receive, send):

    assert scope['type'] == 'http'

    if not scope['client'] in clients_connected.keys():
        """Parse the scope into a dataclass and add it to a dict
        containing the most recently connected clients:
        { ('10.10.10.10', 45003) : HTTPClient }

        Create a timeout callback for the data and add it to the event loop
        """
        c = HTTPClient(scope)
        print(f'ADD ([{c.ident}]) host: {c.host} port: {c.port} agent: {c.agent}')
        clients_connected.update({scope['client'] : c})

        def client_timeout():
            if scope['client'] in clients_connected:
                cc = clients_connected.pop(scope['client'])
                print(f'([{cc.ident}]) TIMEOUT host: {cc.host} port: {cc.port}')

        loop = asyncio.get_running_loop()
        loop.call_later(5, client_timeout)

    await static_files(scope, receive, send)


async def NOT_FOUND(request, exception):
    return Response(status_code= 404)

async def edge(scope, receive, send):

    if scope['type'] == 'http': return await http(scope, receive, send)

app = ExceptionMiddleware(edge, handlers = {404: NOT_FOUND})
