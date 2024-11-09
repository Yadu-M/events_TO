import sqlite3
import click
from datetime import datetime

from flask import Flask
from flask import current_app, g

from backend.dataloader import get_data

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
  
  for index, dataObj in enumerate(get_data()):
    info = dataObj["calEvent"]

    # Populating events table
    db.execute(
      """
      INSERT INTO event (
        id, event_name, description, category, org_name, 
        org_address, org_type, partner_name, 
        accessibility, other_cost_info, start_date, 
        end_date, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      """,
      (
        index,
        info.get("eventName", ""), info.get("description", ""), 
        info.get("categoryString", ""), info.get("orgName", ""), 
        info.get("orgAddress", ""), info.get("orgType", ""), 
        info.get("partnerName", ""), info.get("accessibility", ""),
        info.get("otherCostInfo", ""), info.get("startDate", ""),
        info.get("endDate", ""), datetime.now().ctime()
      )
    )


    # Populating event_date table
    if "dates" in info:
      for event in info["dates"]:
        db.execute(
          """
          INSERT INTO event_date (
            event_id, start_datetime, end_datetime, description
          )
          VALUES (?, ?, ?, ?)
          """,
          (
            index, 
            event.get("startDateTime", ""), 
            event.get("endDateTime", ""),
            event.get("description", "")
          )
        )

    # Populating image table
    if "image" in info:
      url = ""
      thumbNail_url = ""

      if "url" in info["image"]:
        if info["image"]["url"] != "":
          url = "https://secure.toronto.ca" + info["image"]["url"]
    
      if "thumbImage" in info:
        if "url" in info["thumbImage"]:
          if info["thumbImage"]["url"] != "":
            thumbNail_url = "https://secure.toronto.ca" + info["thumbImage"]["url"]

      db.execute(
        """
          INSERT INTO image (
            event_id, alt_text, file_type, url, thumbNail_url 
          )
          VALUES (?, ?, ?, ?, ?)
        """,
        (
          index, 
          info["image"].get("altText", "event Image"),
          info["image"].get("fileType", ""),
          url,
          thumbNail_url
        )
      )

    # Populating feature table
    if "features" in info:
      feature_list = ""
      for feature in info["features"]:
        if info["features"][feature]:
          feature_list += feature + ","
      db.execute( 
        """
          INSERT INTO feature (
            event_id, features
          )
          VALUES (?, ?)
        """,
        (
          index, 
          feature_list[:-1]
        )
      )

    # Populating location table
    if "locations" in info:
      for location in info["locations"]:
        if "geoCoded" in location:
          if location["geoCoded"]:
            location_id = db.execute(
              """
                INSERT INTO location (
                  event_id, name, address, locationType
                ) 
                VALUES (?, ?, ?, ?)
              """,
              (
                index,
                location.get("locationName", ""),
                location.get("address", ""),
                location.get("type", ""),
              )
            ).lastrowid

            if type(location["coords"]) == list:
              for coord in location["coords"]:
                db.execute(
                  """
                    INSERT INTO coords (
                      location_id, lat, lng
                    )
                    VALUES (?, ?, ?)
                  """,
                  (
                    location_id,
                    coord.get("lat", 0),
                    coord.get("lng", 0)
                  )
                )
            else:
              db.execute(
                """
                  INSERT INTO coords (
                    location_id, lat, lng
                  )
                  VALUES (?, ?, ?)
                """,
                (
                  location_id,
                  location["coords"].get("lat", 0),
                  location["coords"].get("lng", 0)
                )
              )
      
    
    db.commit()
    
  # Populating info table
  db.execute(
    f"""
    INSERT INTO info (event_id, event_name, url, lat, lng)
    SELECT event.id, event.event_name, image.url, coords.lat, coords.lng
    FROM event
    JOIN image on event.id = image.event_id
    JOIN location on event.id = location.event_id
    JOIN coords on location.id = coords.location_id 
    """
  )

  db.commit()
    
  
  
@click.command("init-db")
def init_db_command():
  init_db()
  click.echo("Initialized database")
    
def init_app(app: Flask):
  app.teardown_appcontext(close_db)
  app.cli.add_command(init_db_command)
  