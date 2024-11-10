from backend.utils import dict_factory

from flask import (
  Blueprint, flash, g, redirect, session, url_for, request, abort, jsonify
)
from backend.db import get_db

bp = Blueprint('info', __name__, url_prefix='/info')

@bp.route('/')
def get_info():
  db = get_db()
  results = {}
  db.row_factory = dict_factory
  try:
    results = db.execute(
      """
        SELECT info.* FROM info 
        INNER JOIN event on info.event_id = event.id
        WHERE event.end_date > CURRENT_TIMESTAMP
        GROUP BY info.event_id
      """).fetchall()
  except Exception as e:
    print(f'Exception happened {e}')
    abort(404, description="Resource not found")
  return jsonify({ "status": "success", "data": results })
