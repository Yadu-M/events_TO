from flask import Flask, redirect
from flask_cors import CORS

from flaskr import api
from flaskr import command

DEV_CONFIG = 'dev.cfg'

def create_app(config_file=DEV_CONFIG):
  app = Flask(__name__, instance_relative_config=True)
  app.config.from_pyfile(config_file)
  
  app.register_blueprint(api.blueprint)
  api.configue(app)
  
  CORS(app)
  
  @app.route('/')
  def root():
    if app.config['ENV'] == 'development':
      return redirect(app.config['LOCAL_URL'])
    return app.send_static_file('index.html')
  
  return app