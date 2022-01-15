

client = dict( \
    js = '../client/dist/main.js',
    css = '../client/dist/static/main.css',
    index = '../client/dist/index.html'
    )

cache = {}

def initialize_app():
    for t, name in client.items():
        with open(name, 'rb') as f:
            cache.update({t:f.read()})
    print(cache)
    return app

async def read_body(receive):
    """
    Read and return the entire body from an incoming ASGI message.
    """
    body = b''
    more_body = True

    while more_body:
        message = await receive()
        body += message.get('body', b'')
        more_body = message.get('more_body', False)

    return body


async def app(scope, receive, send):
    """
    Echo the request body back in an HTTP response.
    """
    print(dir(scope))
    print(scope)
    body = await read_body(receive)
    
    await send({
        'type': 'http.response.start',
        'status': 200,
        'headers': [
            [b'content-type', b'text/html'],
        ]
    })
    await send({
        'type': 'http.response.body',
        'body': cache['index'],
    })
if __name__ == '__main__':    
    initialize_app()


