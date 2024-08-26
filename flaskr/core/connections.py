import os

import redis
from redis import client

USERNAME = os.environ.get('REDIS_USERNAME')
PASSWORD = os.environ.get('REDIS_PASSWORD')


def get_redis_connection(hostname: str, port: int, username=USERNAME, password=PASSWORD):
  client_kwargs = {
    "host": hostname,
    "port": port,
    "decode_responses": True
  }
  
  if password:
    client_kwargs["password"] = password
  
  if username:
    client_kwargs["username"] = username
  
  return redis.Redis(**client_kwargs)

# def get_redis_timeseries_connection(hostname: str, port: int, username=USERNAME, password=PASSWORD):
#   client_kwargs = {
#     "host": hostname,
#     "port": port,
#     "decode_responses": True
#   }
  
#   if password:
#     client_kwargs["password"] = password
  
#   if username:
#     client_kwargs["username"] = username
  
#   return 