from flask import jsonify, Blueprint, abort, Response

from flaskr.db import get_db
from flaskr.utils import dict_factory

bp = Blueprint("reservation", __name__, url_prefix="/reservation")

@bp.route("/<int:id>")
def get_cost_data(id):
  db = get_db()
  db.row_factory = dict_factory
  results = {}

  try:
    results = db.execute("SELECT * FROM reservation WHERE reservation.eventId = ?", (id,)).fetchone()
  except Exception as e:
    abort(500, description=f"Something went wrong while trying to fetch reservation data: {e}")

  if not results:
    abort(404, description="Couldn't find reservation")
  
  return results
