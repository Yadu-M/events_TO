from flask import Blueprint, abort, Response

from flaskr.db import get_db
from flaskr.utils import dict_factory

bp = Blueprint("image", __name__, url_prefix="/image")


@bp.route("/<int:id>/image")
def get_image(id: int):
  db = get_db()
  try:
    result = db.execute("SELECT file FROM image WHERE eventId = ?", (id, )).fetchone()
  except Exception:
    abort(500, description="An error occured while retrieving icon file")

  if not result:
    abort(404, description="Icon not found")

  image_data = result
  return Response(image_data, mimetype="image/png")

@bp.route("/<int:id>/icon")
def get_icon(id: int):
  db = get_db()
  try:
    result = db.execute("SELECT thumbNail FROM image WHERE eventId = ?", (id, )).fetchone()
  except Exception:
    abort(500, description="An error occured while retrieving icon file")

  if not result:
    abort(404, description="Icon not found")

  image_data = result
  return Response(image_data, mimetype="image/png")

@bp.route("/<int:id>")
def get_image_metadata(id: int):
  db = get_db()
  db.row_factory = dict_factory
  result = {}
  try:
    result = db.execute("SELECT id, eventId, fileName, fileSize, fileType, altText, credit, url FROM image WHERE eventId = ?", (id, )).fetchone()
  except Exception:
    abort(500, description="An error occured while retrieving icon file")

  if not result:
    abort(404, description="Icon not found")

  return result
