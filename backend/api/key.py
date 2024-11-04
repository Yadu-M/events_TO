from flask import Blueprint
from dotenv import load_dotenv
import os

bp = Blueprint('key', __name__, url_prefix='/key')

load_dotenv()
MAPS_API_KEY = os.getenv('MAPS_API_KEY')

@bp.route('/get')
def get():
  return {
    "key": MAPS_API_KEY
  }