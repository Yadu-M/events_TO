import click
from flask import Flask

from . import db
from .helper.geojson import get_geojson_obj
# from .helper.mapbox import update_dataset_features

@click.command("init-db")
def init_db_command():
  db.init_db()
  click.echo("Initialized database")

# @click.command("prepare-geojson")
# def init_geo_json_command():
#   obj = get_geojson_obj()
  
def init_app(app: Flask):
  app.teardown_appcontext(db.close_db)
  app.cli.add_command(init_db_command)
  # app.cli.add_command(init_geo_json_command)
