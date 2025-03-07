from flask import Flask
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix

import os

def import_blueprints(app: Flask):
  from flaskr.blueprint import location, geojson, image, event, cost, date, reservation, weeklyDate
  app.register_blueprint(image.bp)
  app.register_blueprint(location.bp)
  app.register_blueprint(geojson.bp)
  app.register_blueprint(event.bp)
  app.register_blueprint(cost.bp)
  app.register_blueprint(date.bp)
  app.register_blueprint(reservation.bp)
  app.register_blueprint(weeklyDate.bp)
  
def import_commands(app: Flask):
  from . import commands
  commands.init_app(app)

def create_app(test_config=None):
  app = Flask(__name__) 

  app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
  )
  
  CORS(
    app,
    resources={
      r"/*": {
        "origins": [ 
          "https://eventto.ca",
          "https://www.eventto.ca",
          "http://localhost:5173"
        ],
        "methods": ["GET"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": False,
      }
    },
  )

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
  except OSError as e:
    # Checking if error matches "folder already exists error"
    if e.errno != 17:   
      print(f"Some error happened: {e}")

  import_commands(app)
  import_blueprints(app)

  @app.after_request
  def add_security_headers(response):
      response.headers['Content-Security-Policy'] = "default-src 'self' eventto.ca"
      response.headers['X-Content-Type-Options'] = 'nosniff'
      response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
      return response
  
  return app

def get_app():
  return create_app()

if __name__ == '__main__':
  application = create_app()
  application.run()