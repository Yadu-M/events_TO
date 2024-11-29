import click
from flask import Flask

from . import db 

@click.command("init-db")
def init_db_command():
  db.init_db()
  click.echo("Initialized database")
    
def init_app(app: Flask):
  app.teardown_appcontext(db.close_db)
  app.cli.add_command(init_db_command)
