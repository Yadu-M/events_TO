import requests
import os
from json import dumps
from html import unescape

# Toronto Open Data is stored in a CKAN instance. It"s APIs are documented here:
# https://docs.ckan.org/en/latest/api/

# To hit our API, you"ll be making requests to:
base_url = "https://ckan0.cf.opendata.inter.prod-toronto.ca"
secure_base = "https://secure.toronto.ca"

# Datasets are called "packages". Each package can contain many "resources"
# To retrieve the metadata for this package and its resources, use the package name in this page"s URL:
url = base_url + "/api/3/action/package_show"
params = { "id": "festivals-events"}
package_str = requests.get(url, params = params).json()


def fetch_festivals_data() -> list[dict]:
  for meta_data in package_str["result"]["resources"]:    
    if meta_data["format"] == "JSON":      
      res = requests.get(meta_data["url"])
      if not res.ok:
        raise Exception("Something went wrong while fetching...")      
      return res.json()

def sanitize_json(obj):
  # Recursively sanitize JSON objects
  if isinstance(obj, dict):  
      return {key: sanitize_json(value) for key, value in obj.items()}
  elif isinstance(obj, list):  
      return [sanitize_json(element) for element in obj]
  elif isinstance(obj, str):  
      return unescape(obj)  
  else:  
      return obj

def get_data_from_city_db() -> list[dict]:
  data = fetch_festivals_data()  
  return [sanitize_json(event) for event in data]  
