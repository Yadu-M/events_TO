import requests
from geojson import FeatureCollection
from json import dumps

def list_datasets():
  username = "yadii"
  access_token = "sk.eyJ1IjoieWFkaWkiLCJhIjoiY201MWswanJqMXdtYjJsb28yNzlzbjY5aiJ9.6lSDJIjVGesspwop_uihxg"
  response = requests.get(f"https://api.mapbox.com/datasets/v1/{username}", 
                          {"access_token":access_token})  

  if not response.ok:
    print("Something went wrong with the request: ", response.text)
    return

  return response.json()

def update_dataset_features(geojson_obj: FeatureCollection):
  username = "yadii"
  dataset_id = "cm51kdftq0rvg1no9ua2846p7"
  # access_token = "tk.eyJ1IjoieWFkaWkiLCJleHAiOjE3MzUwMjYxODcsImlhdCI6MTczNTAyMjU4Niwic2NvcGVzIjpbImVzc2VudGlhbHMiLCJzY29wZXM6bGlzdCIsIm1hcDpyZWFkIiwibWFwOndyaXRlIiwidXNlcjpyZWFkIiwidXNlcjp3cml0ZSIsInVwbG9hZHM6cmVhZCIsInVwbG9hZHM6bGlzdCIsInVwbG9hZHM6d3JpdGUiLCJzdHlsZXM6dGlsZXMiLCJzdHlsZXM6cmVhZCIsImZvbnRzOmxpc3QiLCJmb250czpyZWFkIiwiZm9udHM6d3JpdGUiLCJzdHlsZXM6d3JpdGUiLCJzdHlsZXM6bGlzdCIsInN0eWxlczpkb3dubG9hZCIsInN0eWxlczpwcm90ZWN0IiwidG9rZW5zOnJlYWQiLCJ0b2tlbnM6d3JpdGUiLCJkYXRhc2V0czpsaXN0IiwiZGF0YXNldHM6cmVhZCIsImRhdGFzZXRzOndyaXRlIiwidGlsZXNldHM6bGlzdCIsInRpbGVzZXRzOnJlYWQiLCJ0aWxlc2V0czp3cml0ZSIsImRvd25sb2FkczpyZWFkIiwidmlzaW9uOnJlYWQiLCJ2aXNpb246ZG93bmxvYWQiLCJuYXZpZ2F0aW9uOmRvd25sb2FkIiwib2ZmbGluZTpyZWFkIiwib2ZmbGluZTp3cml0ZSIsInN0eWxlczpkcmFmdCIsImZvbnRzOm1ldGFkYXRhIiwic3ByaXRlLWltYWdlczpyZWFkIiwiZGF0YXNldHM6c3R1ZGlvIiwiY3VzdG9tZXJzOndyaXRlIiwiY3JlZGVudGlhbHM6cmVhZCIsImNyZWRlbnRpYWxzOndyaXRlIiwiYW5hbHl0aWNzOnJlYWQiXSwiY2xpZW50IjoibWFwYm94LmNvbSIsImxsIjoxNzM0OTkwNzE1OTEwLCJpdSI6bnVsbCwiZW1haWwiOiJ5YWR1eWVtQGdtYWlsLmNvbSJ9.iXDRSvtdtJFZP2zH8HG00Q"
  access_token = "sk.eyJ1IjoieWFkaWkiLCJhIjoiY201MWswanJqMXdtYjJsb28yNzlzbjY5aiJ9.6lSDJIjVGesspwop_uihxg"
  url = f"https://api.mapbox.com/datasets/v1/{username}/{dataset_id}/features"
  features = geojson_obj["features"]

  def split_list(list_to_chunk: list, chunk_size):
    return [list_to_chunk[i: i + chunk_size] for i in range(0, len(list_to_chunk), chunk_size)]

  feature_list = split_list(features, 100)
  
  for index, chunk in enumerate(feature_list):
    payload = {
      "put": chunk,
      "delete": []
    }
    response = requests.post(url=url, params={"access_token": access_token}, json=payload)
    if not response.ok:      
      print(f"Something went wrong while uploading {index}'th chunk: ", response.text, " \nstatus code:", response.status_code)
      return False

  return True
    