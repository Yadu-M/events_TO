from flaskr.blueprint import location, event, cost
from geojson import FeatureCollection, Feature

# "eventId"
# "eventName"
# "startDate": event_obj["startDate"],
# "endDate"
# "description"
# "locationName"
# "address"
# "eventWebsite"
# "freeEvent"
# "category"
# "accessibility"
# "cost"
# "reservationsRequired"
# "reservation"
# "features"

def get_geojson_obj():
  location_obj = location.get_location_data()
  features: list[Feature] = []
 
  for feature in location_obj:
    event_id = feature["eventId"]
    event_obj = {}
    cost_obj = {}
       
    try:      
      event_obj = event.get_event_data(event_id)
      cost_obj = cost.get_cost_data(event_id)
    except Exception:
      pass
    finally:
      accessibility = event_obj.get("accessibility", "")
      if accessibility == "full":
        accessibility = True
      else:
        accessibility = False
        
      properties = {
        "eventId": event_id,
        "eventName": event_obj["eventName"],
        "startDate": event_obj["startDate"],
        "endDate": event_obj["endDate"],
        "description": event_obj["description"],
        "locationName": feature["locationName"],
        "address": feature["address"],
        "eventWebsite": event_obj["eventWebsite"],
        "freeEvent": event_obj["freeEvent"],
        "category": event_obj["categoryString"],        
        "reservationsRequired": event_obj["reservationsRequired"],
        "features": event_obj["features"],
        "accessibility": accessibility,
        "cost": cost_obj, 
      }
      
      geometry = {
        "coordinates":[feature["lng"], feature["lat"]],
        "type": "Point"
      }
      
      # Have to cast id to string or mapbox will fail to update features
      feature = Feature(id=str(feature["id"]), properties=properties, geometry=geometry)
      features.append(feature)
      
  return FeatureCollection(features)
