import os
from dotenv import load_dotenv

load_dotenv()

class Config:
  CACHE_TYPE = 'redis'
  CACHE_REDIS_HOST = os.getenv('CACHE_REDIS_HOST', 'localhost')
  CACHE_REDIS_PORT = int(os.getenv('CACHE_REDIS_PORT', 6379))
  CACHE_REDIS_DB = int(os.getenv('CACHE_REDIS_DB', 0))
  REDIS_HOST = os.getenv('REDIS_HOST', 'localhost')
  REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
  REDIS_PASSWORD = os.getenv('REDIS_PASSWORD', None)