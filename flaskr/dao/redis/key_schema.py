import datetime

def prefixed_key(f):
  def prefixed_method(self, *args, **kwargs):
    key = f(self, *args, **kwargs)
    return f"P{self.prefix}:{key}"
  
  return prefixed_method

class KeySchema:
  
  def __init__(self, prefix: str) -> None:
    self.prefix = prefix
