from flask import Blueprint, abort

from geojson import FeatureCollection

from flaskr.helper.geojson import get_geojson_obj
from flask.helpers import make_response

bp = Blueprint("geojson", __name__, url_prefix="/geojson")

@bp.route("/")
def get_geojson_data():
  results: FeatureCollection = {}  
  try:
    results = get_geojson_obj()
  except Exception as e:
    print(f"Error: {e}")
    abort(500, description=f"Something went wrong while trying to geojson data")

  if not results:    
    abort(404, description="Empty gejson data found")

  response = make_response(results)
  response.headers["Content-Type"] = "application/geo+json"
  return response
