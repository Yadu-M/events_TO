from flaskr.blueprint import location

from geojson import FeatureCollection, Feature

def get_geojson_obj(byte_format=False):
  data = location.get_relevant_location_data()
  features: list[Feature] = []

  for location_obj in data:
    properties = {
      "id": location_obj["id"],
      "eventId": location_obj["eventId"],
      "locationName": location_obj["locationName"],
      "address": location_obj["address"],
      "displayAddress": location_obj["displayAddress"]
    }

    geometry = {
      "coordinates":[location_obj["lng"], location_obj["lat"]],
      "type": "Point"
    }

    # Have to cast id to string or mapbox will fail to update features
    feature = Feature(id=str(location_obj["id"]), properties=properties, geometry=geometry)
    features.append(feature)

  return FeatureCollection(features)
