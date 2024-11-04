from backend.utils import dict_factory

from flask import (
  Blueprint, flash, g, redirect, session, url_for, request, abort, jsonify
)
from backend.db import get_db

bp = Blueprint('image', __name__, url_prefix='/image')

@bp.route('/get')
def get_image():
  db = get_db()
  results = {}
  db.row_factory = dict_factory
  try:
    results = db.execute(
      """
        SELECT event.id, image.alt_text, image.url, image.thumbNail_url
        FROM event
        INNER JOIN image ON event.id = image.event_id
        WHERE end_date > CURRENT_TIMESTAMP
      """).fetchall()
  except Exception as e:
    print(f'Exception happened {e}')
    abort(404, description="Resource not found")
  return jsonify({ "status": "success", "data": results })
