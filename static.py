
from starlette.staticfiles import StaticFiles
static_files = StaticFiles(directory='dist', html=True)
