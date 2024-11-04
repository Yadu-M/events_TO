from backend.utils import dict_factory

from flask import (
  Blueprint, flash, g, redirect, session, url_for, request, abort, jsonify
)
from backend.db import get_db

bp = Blueprint('location', __name__, url_prefix='/event')

@bp.route('/get/<id>')
def get_location(id):
  db = get_db()
  # result = {}
  # db.row_factory = dict_factory
  # try:
  #   results = db.execute("SELECT * FROM event WHERE end_date > CURRENT_TIMESTAMP").fetchall()
  # except Exception:
  #   abort(404, description="Resource not found")
  print(id)
  return jsonify({ "status": "success", "data": "sucess" })

