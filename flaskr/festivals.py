import requests
from datetime import datetime
import json

# Toronto Open Data is stored in a CKAN instance. It's APIs are documented here:
# https://docs.ckan.org/en/latest/api/

# To hit our API, you'll be making requests to:
base_url = 'https://ckan0.cf.opendata.inter.prod-toronto.ca'
secure_base = 'https://secure.toronto.ca'

# Datasets are called 'packages'. Each package can contain many 'resources'
# To retrieve the metadata for this package and its resources, use the package name in this page's URL:
url = base_url + '/api/3/action/package_show'
params = { 'id': 'festivals-events'}
package_str = requests.get(url, params = params).json()

  

def get_festivals_data() -> list[dict]:
  for meta_data in package_str['result']['resources']:
    
    if meta_data['format'] == 'JSON':
      
      res = requests.get(meta_data['url'])
      if not res.ok:
        raise Exception('Something went wrong while fetching...')
      
      return res.json()
      
      # f_data = open('data.json', 'w')
      # f_meta_data = open('metadata.json', 'w')
      
      # data = requests.get(meta_data['url']).text
      
      # f_data.write(data)
      # f_meta_data.write(json.dumps(meta_data))
      
      # f_meta_data.close()
      # f_data.close()
    
def get_readable_date(date: str) -> str:
  # Convert the string to a datetime object
  try:
    date_obj = datetime.strptime(date, "%Y-%m-%dT%H:%M:%S.%fZ")
    return date_obj.strftime("%Y %B %d %A %-I%p").lstrip('0')
  except Exception as e:
    print(date, e)

def format_dates(event: dict) -> None:
  if 'endDate' in event:
    event['endDate'] = get_readable_date(event['endDate'])
    
  if 'dates' in event:
    for date in event['dates']:
      date['startDateTime'] = get_readable_date(date['startDateTime'])
      date['endDateTime'] = get_readable_date(event['endDateTime'])
  
  if 'startDate' in event:
    date['startDate'] = get_readable_date(event['startDate'])

def get_festival_obj() -> list[dict]:
  obj = get_festivals_data()
  
  for i, event in enumerate(obj):
    try:
      format_dates(event['calEvent'])
    except Exception as e:
      print(i)
      break
  
  return obj
  
print(json.dumps(get_festival_obj()[0]))