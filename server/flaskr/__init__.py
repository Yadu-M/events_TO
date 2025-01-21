from flask import Flask
from flask_cors import CORS

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
  app = Flask(__name__, instance_relative_config=True)
  CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
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

  

  return app
