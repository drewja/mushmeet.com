
from starlette.staticfiles import StaticFiles
from starlette.exceptions import ExceptionMiddleware
from starlette.responses import Response

asgi_func = StaticFiles(directory='client/dist', html=True)

async def ap(scope, receive, send):
    assert scope['type'] == 'http'
    await asgi_func(scope, receive, send)


async def NOT_FOUND(request, exception):
    return Response(status_code= 404)

app = ExceptionMiddleware(ap, handlers = {404: NOT_FOUND})