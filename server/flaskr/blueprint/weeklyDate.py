from flask import Blueprint, abort

from flaskr.db import get_db
from flaskr.utils import dict_factory

bp = Blueprint("weeklydate", __name__, url_prefix="/weeklydate")

@bp.route("/<int:id>")
def get_weekly_date_data(id):
  db = get_db()
  db.row_factory = dict_factory
  results = {}

  try:
    results = db.execute("SELECT * FROM weeklyDate WHERE weeklyDate.eventId = ?", (id,)).fetchone()
  except Exception as e:
    abort(500, description=f"Something went wrong while trying to fetch weekly date: {e}")

  if not results:    
    abort(404, description="Couldn't find weekly date")
  
  return results
