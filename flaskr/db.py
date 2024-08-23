import redis

import click
from flask import current_app, g

def get_db():
  try:
    if 'db' not in g:
      g.db = redis.Redis(
        host=current_app.config['REDIS_HOST'],
        port=current_app.config['REDIS_PORT'],
        password=current_app.config['REDIS_PASSWORD']
      )
  except redis.ConnectionError as e:
    current_app.logger.error(f"Redis connection failed: {e}")
  
  return g.db

def close_db(e=None):
  db = g.pop('db', None)
  
  if db is not None:
    db.close()
    
def init_db():
  db = get_db()
      

@click.command('init-db')
def init_db_command():
  """Repopulate database"""
  # init_