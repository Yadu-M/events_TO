from flask import jsonify, Blueprint, abort, Response

from flaskr.db import get_db
from flaskr.utils import dict_factory

bp = Blueprint("cost", __name__, url_prefix="/cost")

@bp.route("/<int:id>")
def get_cost_data(id):
  db = get_db()
  db.row_factory = dict_factory
  results = {}

  try:
    results = db.execute("""
      SELECT 
        c.child,
        c.youth,
        c.student,
        c.adult,
        c.senior,
        c._from,
        c._to,
        c.generalAdmission
      FROM cost as c
      WHERE c.eventId = ?
      """, (id,)).fetchone()
  except Exception as e:
    abort(500, description=f"Something went wrong while trying to fetch event data: {e}")

  if not results:
    abort(404, description="Couldn't find cost")
  
  return results
