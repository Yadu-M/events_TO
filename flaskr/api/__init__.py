import os

from flask import Blueprint
from flask_restful import Api

from flaskr.dao.redis.key_schema import KeySchema

blueprint = Blueprint("api", __name__)
api = Api(blueprint)

def configue(app):
  key_schema = KeySchema(app.config['REDIS_KEY_PREFIX'])
