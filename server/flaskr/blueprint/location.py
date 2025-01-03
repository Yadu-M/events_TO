from flask import Blueprint, abort

from flaskr.db import get_db
from flaskr.utils import dict_factory

bp = Blueprint("location", __name__, url_prefix="/location")

@bp.route("/")
def get_location_data():
  db = get_db()
  db.row_factory = dict_factory
  results = {}

  try:
    results = db.execute("""
      SELECT l.id, l.eventId, l.lat, l.lng, l.address, l.displayAddress, l.locationName FROM location AS l
      JOIN event ON event.id = l.eventId
      WHERE event.endDate > CURRENT_TIMESTAMP;
    """).fetchall()
  except Exception as e:
    abort(500, description=f"Something went wrong while trying to fetch location data: {e}")

  if not results:
    abort(404, description="Couldn't find any locations")
  
  return results

@bp.route("/<int:id>")
def get_specific_location_data(id):
  db = get_db()
  db.row_factory = dict_factory
  results = {}

  try:
    results = db.execute("SELECT * FROM location WHERE eventId = ?", (id, )).fetchall()
  except Exception as e:
    abort(500, description=f"Something went wrong while trying to fetch location data: {e}")

  if not results:
    abort(404, description="Couldn't find the specific location")
  
  return results
