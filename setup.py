from setuptools import setup

setup(name='mushmeet',
      version='0.0.0.1',
      description='A website',
      url='http://github.com/drewja/mushmeet.com',
      author='Andrew Arendt',
      author_email='andrewarendt@gmail.com',
      install_requires=[
          'starlette',
          'uvicorn'
      ],
      zip_safe=False)
