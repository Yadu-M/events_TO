def query_builder(keys: list[str], table: str):  
  seperated_keys = ",".join(map(str, keys))
  commas = ",".join(['?' for _ in range(len(keys))])
  return f"INSERT INTO {table} ({seperated_keys}) VALUES ({commas})"  

def update_table(db, obj: dict, table: str):
  if not len(obj):
    return
  query = query_builder(obj.keys(), table)
  return db.execute(query, tuple(obj.values()))
    
def get_event_obj(data: dict):
  features = ""
  if "features" in data:    
    for featureObj in data["features"]:
      if data["features"][featureObj]:
        features += featureObj + ","

    features = features[:-1]
            
  return {
    "eventName": data.get("eventName", None),
    "eventWebsite": data.get("eventWebsite", None),
    "eventEmail": data.get("eventEmail", None),
    "eventPhone": data.get("eventPhone", None),
    "eventPhoneExt": data.get("eventPhoneExt", None),
    "partnerType": data.get("partnerType", None),
    "partnerName": data.get("partnerName", None),
    "expectedAvg": data.get("expectedAvg", None),
    "accessibility": data.get("accessibility", None),
    "frequency": data.get("frequency", None),
    "startDate": data.get("startDate", None),
    "endDate": data.get("endDate", None),
    "timeInfo": data.get("timeInfo", None),
    "freeEvent": data.get("freeEvent", None),
    "orgName": data.get("orgName", None),
    "contactName": data.get("contactName", None),
    "contactTitle": data.get("contactTitle", None),
    "orgAddress": data.get("orgAddress", None),
    "orgPhone": data.get("orgPhone", None),
    "orgPhoneExt": data.get("orgPhoneExt", None),
    "orgFax": data.get("orgFax", None),
    "orgEmail": data.get("orgEmail", None),
    "orgType": data.get("orgType", None),
    "orgTypeOther": data.get("orgTypeOther", None),
    "categoryString": data.get("categoryString", None),
    "description": data.get("description", None),
    "allDay": data.get("allDay", None),
    "reservationsRequired": data.get("reservationsRequired", ""),
    "features": features
  }

def get_date_obj(index: int, data: dict):
  startDateTime = ""
  endDateTime = ""
  allDay = False
  for dateObj in data:                
    if "startDateTime" in dateObj and dateObj["startDateTime"]:
      startDateTime += dateObj.get("startDateTime", "") + ","
    if "endDateTime" in dateObj and dateObj["endDateTime"]:
      endDateTime += dateObj.get("endDateTime", "") + ","
    if "allDay" in dateObj and dateObj["allDay"]:          
        allDay = True   
        
  return {
    "eventId": index,
    "startDateTime": startDateTime[:-1],
    "endDateTime": endDateTime[:-1],
    "allDay": allDay
  }

def get_weekly_date_obj(index: int, data: dict):
  day = ""
  startTime = ""
  endTime = ""
  description = ""
  for weeklyDateObj in data:
    if "weekDay" in weeklyDateObj:      
      day += weeklyDateObj["weekDay"][0]["day"] + ","
    if "startTime" in weeklyDateObj:
      startTime += weeklyDateObj["startTime"] + ","
    if "endTime" in weeklyDateObj:
      endTime += weeklyDateObj["endTime"] + ","
    if "description" in weeklyDateObj:
      description += weeklyDateObj["description"] + ","
      
  return {
    "eventId": index,
    "day": day[:-1],
    "startTime": startTime[:-1],
    "endTime" : endTime[:-1],
    "description": description[:-1]
  }

def get_location_obj(index: int, data: dict):
  locationName = ""
  address = ""
  lat = ""
  lng = ""
  displayAddress = ""
  for location_obj in data:
    geo_coded = "geoCoded" in location_obj and location_obj["geoCoded"]
    coords = "coords" in location_obj and type(location_obj["coords"]) != list
    if geo_coded and coords:
      locationName = location_obj.get("locationName", None)
      address = location_obj.get("address", "")
      lat = location_obj["coords"]["lat"]
      lng = location_obj["coords"]["lng"]
      displayAddress = location_obj.get("displayAddress", None)
    else:
      return {}

  return {
    "eventId": index,
    "locationName": locationName,
    "address": address,
    "lat": lat,
    "lng": lng,
    "displayAddress": displayAddress
  }

def get_cost_obj(index: int, data: dict):  
  child = data.get("child", None)
  youth = data.get("youth", None)
  student = data.get("student", None)
  adult = data.get("adult", None)
  senior = data.get("senior", None)
  _from = data.get("from", None)
  _to = data.get("to", None)
  ga = data.get("ga", None)

  return {
    "eventId" : index,
    "child": child,
    "youth": youth,
    "student" : student,
    "adult": adult,
    "senior": senior,
    "_from": _from,
    "_to": _to,
    "generalAdmission": ga    
  }

def get_image_obj(index: int, data: dict):
  fileName = data.get("fileName", None)
  fileSize = data.get("fileSize", None)
  fileType = data.get("fileType", None)
  altText = data.get("altText", None)
  credit = data.get("credit", None)
  url = data.get("url", None)
  
  if url == "":
    return {}

  from .image import get_image_blob, get_thumbnail
  fullUrl = "https://secure.toronto.ca" + url
  file = get_image_blob(fullUrl)
  thumbNail = get_thumbnail(file)

  return {
    "eventId": index,
    "fileName": fileName,
    "fileSize": fileSize,
    "fileType": fileType,
    "altText": altText,
    "credit": credit,
    "url": fullUrl,
    "file": file,
    "thumbNail": thumbNail
  }  

def get_reservation_obj(index: int, data: dict):
  website = data.get("website", None)
  phone = data.get("phone", None)
  phoneExt = data.get("phoneExt", None)
  email = data.get("email", None)

  return {
    "eventId": index,
    "website": website,
    "phone": phone,
    "phoneExt": phoneExt,
    "email": email
  }
  