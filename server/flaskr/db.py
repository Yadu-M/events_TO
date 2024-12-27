from flask import current_app, g

import sqlite3

from . import fetch
from flaskr.helper.db import get_cost_obj, get_date_obj, get_event_obj, get_feature_obj, get_image_obj, get_location_obj, get_weekly_date_obj, init_table

def get_db():
  if "db" not in g:
    g.db = sqlite3.connect(
      current_app.config["DATABASE"],
      detect_types=sqlite3.PARSE_DECLTYPES
    )
  g.db.row_factory = sqlite3.Row
  return g.db


def close_db(e=None):
  db = g.pop("db", None)
  if db is not None:
    db.close()


def init_db():
  db = get_db()  
  with current_app.open_resource("schema.sql") as f:
    db.executescript(f.read().decode("utf8"))

  data = fetch.get_data_from_city_db()  
  for index, data_obj in enumerate(data):   
    data = data_obj["calEvent"]        
    event = get_event_obj(data)    
    feature = {}
    date = {}
    weeklyDate = {}
    location = {}
    cost = {}
    image = {}
    
    if "features" in data:      
      feature = get_feature_obj(index, data["features"])
    if "dates" in data:
      date = get_date_obj(index, data["dates"])
    if "weeklyDates" in data:
      weeklyDate = get_weekly_date_obj(index, data["weeklyDates"])
    if "locations" in data:      
      location = get_location_obj(index, data["locations"])
    if "cost" in data:
      cost = get_cost_obj(index, data["cost"])
    if "image" in data:
      image = get_image_obj(index, data["image"])

    init_table(db, event, "event")
    init_table(db, feature, "feature")
    init_table(db, date, "date")
    init_table(db, weeklyDate, "weeklyDate")
    init_table(db, location, "location")
    init_table(db, cost, "cost")
    init_table(db, image, "image")

  db.commit()
 