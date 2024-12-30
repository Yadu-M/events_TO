from flask import Blueprint, abort

from geojson import FeatureCollection
from io import BytesIO
from json import dumps

from flaskr.helper.geojson import get_geojson_obj
from flask.helpers import make_response

bp = Blueprint("geojson", __name__, url_prefix="/geojson")

@bp.route("/")
def get_geojson_data():
  results: FeatureCollection = {}  
  file = None  
  try:
    results = get_geojson_obj()
    file = BytesIO(bytes(dumps(results), encoding="utf-8"))
  except Exception as e:
    print(f"Error: {e}")
    abort(500, description=f"Something went wrong while trying to geojson data")

  if not results:
    abort(404, description="Empty gejson data found")

  response = make_response(results)
  response.headers["Content-Type"] = "application/geo+json"
  return response
