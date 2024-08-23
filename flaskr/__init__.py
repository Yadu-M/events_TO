import os
from flask_caching import Cache
from flask import Flask

from config import Config

def create_app(test_config=None):
  app = Flask(__name__)
  app.config.from_object(Config)
  
  # Override with test config if provided
  if test_config:
    app.config.update(test_config)

  # Initialize Flask-Caching with Redis
  # cache = Cache(app)


  # A simple page that says hello
  @app.route('/hello')
  def hello():
    return 'Hello, World!'

  return app
