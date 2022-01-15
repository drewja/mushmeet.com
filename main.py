
from starlette.staticfiles import StaticFiles

asgi_func = StaticFiles(directory='client/dist', html=True)

async def app(scope, receive, send):
    assert scope['type'] == 'http'
    await asgi_func(scope, receive, send)
