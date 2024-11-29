def query_builder(keys: list[str], obj: dict, table: str):
  for key in keys:
    if key not in obj:
      print(f"{key} not in obj")
      return
  query = ""
  seperated_keys = ",".join(map(str, keys))
  commas = ",".join(['?' for _ in range(len(keys))])
  query += f"INSERT INTO {table} ({seperated_keys}) VALUES ({commas})"  
  return query

def init_table(db, obj: dict, table: str):  
  keys = obj.keys()
  if len(keys) == 0:
    return
  query = query_builder(keys, obj, table)
  return db.execute(query, tuple(obj.values()))
    
def get_event_obj(data: dict):
  return {
    "eventName": data.get("eventName", ""),
    "eventWebsite": data.get("eventWebsite", ""),
    "eventEmail": data.get("eventEmail", ""),
    "eventPhone": data.get("eventPhone", ""),
    "eventPhoneExt": data.get("eventPhoneExt", ""),
    "partnerType": data.get("partnerType", ""),
    "partnerName": data.get("partnerName", ""),
    "expectedAttendance": data.get("expectedAttendance", ""),
    "accessibility": data.get("accessibility", ""),
    "frequency": data.get("frequency", ""),
    "startDate": data.get("startDate", ""),
    "endDate": data.get("endDate", ""),
    "timeInfo": data.get("timeInfo", ""),
    "freeEvent": data.get("freeEvent", ""),
    "orgName": data.get("orgName", ""),
    "contactName": data.get("contactName", ""),
    "contactTitle": data.get("contactTitle", ""),
    "orgAddress": data.get("orgAddress", ""),
    "orgPhone": data.get("orgPhone", ""),
    "orgPhoneExt": data.get("orgPhoneExt", ""),
    "orgFax": data.get("orgFax", ""),
    "orgEmail": data.get("orgEmail", ""),
    "orgType": data.get("orgType", ""),
    "orgTypeOther": data.get("orgTypeOther", ""),
    "categoryString": data.get("categoryString", ""),
    "description": data.get("description", ""),
    "allDay": data.get("allDay", "")
  }

def get_feature_obj(index: int, data: dict):  
  features = ""
  for featureObj in data:
    if data[featureObj]:
      features += featureObj + ","            
  return {        
    "eventId": index,
    "features": features[:-1]
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
      day += ",".join(weeklyDateObj["weekDay"][0]["day"])
    if "startTime" in weeklyDateObj:
      startTime += ",".join(weeklyDateObj["startTime"])
    if "endTime" in weeklyDateObj:
      endTime += ",".join(weeklyDateObj["endTime"])
    if "description" in weeklyDateObj:
      description += ",".join(weeklyDateObj["description"])
      
  return {
    "eventId": index,
    "day": day,
    "startTime": startTime,
    "endTime" : endTime,
    "description": description
  }

def get_location_obj(index: int, data: dict):
  locationName = ""
  address = ""
  lat = ""
  lng = ""
  displayAddress = ""
  for locationObj in data:
    if "geoCoded" in locationObj and "type" in locationObj:
      if locationObj["geoCoded"] and locationObj["type"] == "marker":
        locationName = locationObj.get("locationName", "") + ","
        address = locationObj.get("address", "") + ","
        lat = locationObj.get("lat", "") + ","
        lng = locationObj.get("lng", "") + ","
        displayAddress = locationObj.get("displayAddress", "") + ","
              
  return {
    "eventId": index,
    "locationName": locationName[:-1],
    "address": address[:-1],
    "lat": lat[:-1],
    "lng": lng[:-1],
    "displayAddress": displayAddress[:-1]
  }

def get_cost_obj(index: int, data: dict):  
  child = data.get("child", "")
  youth = data.get("youth", "")
  student = data.get("student", "")
  adult = data.get("adult", "")
  senior = data.get("senior", "")
  _from = data.get("from", "")
  to = data.get("to", "")

  return {
    "eventId" : index,
    "child": child,
    "youth": youth,
    "student" : student,
    "adult": adult,
    "senior": senior,
    "fromT": _from,
    "toT": to
  }

def get_image_obj(index: int, data: dict):
  fileName = data.get("fileName", "")
  fileSize = data.get("fileSize", "")
  fileType = data.get("fileType", "")
  altText = data.get("altText", "")
  credit = data.get("credit", "")
  url = data.get("url", "")  

  return {
    "eventId": index,
    "fileName": fileName,
    "fileSize": fileSize,
    "fileType": fileType,
    "altText": altText,
    "credit": credit,
    "url": url,
  }  
  