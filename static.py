
from starlette.staticfiles import StaticFiles
static_files = StaticFiles(directory='client/dist', html=True)
