import os
from flask import Flask

def import_commands(app: Flask):
  from . import commands
  commands.init_app(app)

def create_app(test_config=None):
  app = Flask(__name__, instance_relative_config=True)
  app.config.from_mapping(
      SECRET_KEY="dev",
      DATABASE=os.path.join(app.instance_path, 'db.sqlite')
  )
  
  if test_config is None:
      app.config.from_pyfile('config.py', silent=True)
  else:
      app.config.from_mapping(test_config)

  try:
      os.makedirs(app.instance_path)
  except OSError:
      print("Instance folder missing")

  import_commands(app)  

  return app
