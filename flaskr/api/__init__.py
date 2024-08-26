from flask import Blueprint
from flask_restful import Api

from redis import Redis
from redis import exceptions

from flaskr.api.keys import ApiKeyResource

import os
from dotenv import load_dotenv

load_dotenv()
blueprint = Blueprint('api', __name__, url_prefix='/api')
api = Api(blueprint)

def configure(app):
    # Initialize Redis client
  REDIS_PASSWORD = os.getenv('REDIS_PASSWORD')  
  
  redis_client = Redis(
      host=app.config['REDIS_HOST'],
      port=app.config['REDIS_PORT'],
      password=REDIS_PASSWORD
  )
  
  # Check Redis connection
  try:
      redis_client.ping()
  except exceptions.AuthenticationError:
      app.logger.error("Redis authentication failed")
      

  api.add_resource(ApiKeyResource, '/key')