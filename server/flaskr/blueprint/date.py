from flask import jsonify, Blueprint, abort, Response

from flaskr.db import get_db
from flaskr.utils import dict_factory

bp = Blueprint("date", __name__, url_prefix="/date")

@bp.route("/<int:id>")
def get_date_data(id):
  db = get_db()
  db.row_factory = dict_factory
  results = {}

  try:
    results = db.execute("SELECT * FROM date WHERE date.eventId = ?", (id,)).fetchone()
  except Exception as e:
    abort(500, description=f"Something went wrong while trying to fetch date: {e}")

  if not results:    
    abort(404, description="Couldn't find date")
  
  return results
