from sqlite3 import Cursor

def dict_factory(cursor: Cursor, row):
  fields = [col[0] for col in cursor.description]
  return {key: value for key, value in zip(fields, row)}