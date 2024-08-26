from flask_restful import Resource
from webargs import fields
from webargs.flaskparser import use_args 

import os
from dotenv import load_dotenv

load_dotenv()

class ApiKeyResource(Resource):
  @use_args({'key': fields.Str(required=False)}, location='query')
  def get(self, args) -> dict:
    KEY = os.getenv('API_KEY')
    return {
      "key": KEY
    }