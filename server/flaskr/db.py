from flask import current_app, g

import sqlite3

from . import fetch
from flaskr.helper import db as db_helper

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
    index += 1
    data = data_obj["calEvent"]        
    event = db_helper.get_event_obj(data)    
    feature = {}
    date = {}
    weeklyDate = {}
    location = {}
    cost = {}
    image = {}
    reservation = {}
    
    db_helper.update_table(db, event, "event")    
      
    if "dates" in data:
      date = db_helper.get_date_obj(index, data["dates"])
      db_helper.update_table(db, date, "date")
      
    if "weeklyDates" in data:
      weeklyDate = db_helper.get_weekly_date_obj(index, data["weeklyDates"])
      db_helper.update_table(db, weeklyDate, "weeklyDate")
      
    if "locations" in data:      
      location = db_helper.get_location_obj(index, data["locations"])
      db_helper.update_table(db, location, "location")
      
    if "cost" in data:
      cost = db_helper.get_cost_obj(index, data["cost"])
      db_helper.update_table(db, cost, "cost")
      
    if "image" in data:
      image = db_helper.get_image_obj(index, data["image"])
      db_helper.update_table(db, image, "image")

    if "reservation" in data:
      reservation = db_helper.get_reservation_obj(index, data["reservation"])
      db_helper.update_table(db, reservation, "reservation")

  db.commit()
 