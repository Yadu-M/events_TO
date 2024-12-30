from flask import jsonify, Blueprint, abort, Response

from flaskr.db import get_db
from flaskr.utils import dict_factory

bp = Blueprint("image", __name__, url_prefix="/image")

@bp.route("/metadata")
def get_all_icons_metadata():
  db = get_db()
  db.row_factory = dict_factory
  try:
    query = """
      SELECT DISTINCT 
        image.id, image.eventId, image.altText, image.credit, image.url, lat, lng    
      FROM image
      INNER JOIN event ON event.id = image.eventId
      INNER JOIN location ON location.eventId = image.eventId
      WHERE event.endDate > CURRENT_TIMESTAMP;
    """
    results = db.execute(query).fetchall()
  except Exception as e:    
    abort(500, description=f"An error occurred: {e}")
    
  if not results:
    abort(404, description="No icons found")

  return jsonify(results)

@bp.route("/<int:id>/image")
def get_icon_file(id: int):
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
def get_thumbnail(id: int):
  db = get_db()
  try:
    result = db.execute("SELECT thumbNail FROM image WHERE eventId = ?", (id, )).fetchone()
  except Exception:
    abort(500, description="An error occured while retrieving icon file")

  if not result:
    abort(404, description="Icon not found")

  image_data = result
  return Response(image_data, mimetype="image/png")
