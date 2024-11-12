from backend.utils import dict_factory

from flask import (
  Blueprint, flash, g, redirect, session, url_for, request, abort, jsonify
)
from backend.db import get_db

bp = Blueprint('event', __name__, url_prefix='/event')

@bp.route('/')
def get_events():
  db = get_db()
  result = {}
  db.row_factory = dict_factory
  try:
    results = db.execute("SELECT * FROM event WHERE end_date > CURRENT_TIMESTAMP").fetchall()
  except Exception:
    abort(404, description="Resource not found")
  return jsonify({ "status": "success", "data": results })

@bp.route('/<event_id>')
def get_specific_event(event_id):
  db = get_db()
  result = {}
  db.row_factory = dict_factory
  try:
    results = db.execute("SELECT * FROM event WHERE event.id = ?", (event_id, )).fetchone()
  except Exception:
    abort(404, description="Resource not found")
  return jsonify({ "status": "success", "data": results })

@bp.route('/getAll')
def get_all_events():
  db = get_db()
  result = {}
  db.row_factory = dict_factory
  try:
    results = db.execute("SELECT * FROM event WHERE end_date").fetchall()
  except Exception:
    abort(404, description="Resource not found")

  return jsonify({ "status": "success", "data": results })


  