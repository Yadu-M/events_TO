from flask import jsonify, Blueprint, abort, Response

from flaskr.db import get_db
from flaskr.utils import dict_factory

bp = Blueprint("event", __name__, url_prefix="/api/event")

@bp.route("/<int:id>")
def get_event_data(id):
  db = get_db()
  db.row_factory = dict_factory
  results = {}

  try:
    results = db.execute("SELECT * FROM event WHERE event.id = ?", (id,)).fetchone()
  except Exception as e:
    abort(500, description=f"Something went wrong while trying to fetch event data: {e}")

  if not results:    
    print(f"Couldn't find event with eventId: ${id}")
    abort(404, description="Couldn't find event")
  
  return results
