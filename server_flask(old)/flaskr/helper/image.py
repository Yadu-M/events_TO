from PIL import Image
from io import BytesIO
import requests

def get_image_blob(url: str):
  req = requests.get(url)
  if not req.ok:
    print("Cant fetch image at: ", url)
    return
  return req.content

def get_thumbnail(image_bytes: bytes):
  def image_to_bytes(image: Image.Image, format: str = None) -> bytes:    
    try:
        byte_io = BytesIO()
        image.save(byte_io, format=format or image.format or 'PNG') # If a format is not provided, try to retain original format, else default to PNG
        return byte_io.getvalue()
    except Exception as e:
      print(f"Error converting image to bytes: {e}")
      return None
    
  try:
    image = Image.open(BytesIO(image_bytes))
    image_copy = image.copy()
    image_copy.thumbnail((128, 128))
    return image_to_bytes(image_copy)
  except Exception as e:
    print(f"Error creating thumbnail: ${e}")
    return None
  