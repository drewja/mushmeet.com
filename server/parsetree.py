

HTTP_METHODS = ['GET', 'POST', 'HEAD', 'PUT']

class requestParseTree(object):
    def __init__(self, *implements):
        self.implements = implements
    def handler(self, method, func):
        
        
class App(object):
    def __init__(self):
        self.handlers = {}
        
    def method(self, http_method, handler):
        try:
            self.handlers[http_method].append(handler)
        except:
            self.handlers.update({http_method : [handler]})

@app.method('GET')
@app.