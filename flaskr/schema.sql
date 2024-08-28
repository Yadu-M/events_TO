DROP TABLE IF EXISTS event;

DROP TABLE IF EXISTS event_date;

DROP TABLE IF EXISTS image;

DROP TABLE IF EXISTS feature;

DROP TABLE IF EXISTS location;

DROP TABLE IF EXISTS coords;

CREATE TABLE
  event (
    id INTEGER PRIMARY KEY,
    event_name TINYTEXT NOT NULL,
    description TEXT,
    category TEXT,
    org_name TINYTEXT,
    org_address TINYTEXT,
    org_type TINYTEXT,
    partner_name TINYTEXT,
    accessibility TINYTEXT NOT NULL,
    other_cost_info TINYTEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
  );

CREATE TABLE
  event_date (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    start_datetime DATETIME,
    end_datetime DATETIME,
    description TEXT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES event (id)
  );

CREATE TABLE
  image (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    alt_text TINTYTEXT,
    file_type TINYTEXT,
    url TINYTEXT,
    thumbNail_url TINYTEXT,
    FOREIGN KEY (event_id) REFERENCES event (id)
  );

CREATE TABLE
  feature (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    features TINYTEXT,
    FOREIGN KEY (event_id) REFERENCES event (id)
  );

CREATE TABLE
  location (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    name TINYTEXT NOT NULL,
    address TINYTEXT NOT NULL,
    locationType TINYTEXT CHECK (
      locationType in ("marker", "polygon", "polyline", "")
    ),
    FOREIGN KEY (event_id) REFERENCES event (id)
  );

CREATE TABLE
  coords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_id INTEGER NOT NULL,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    FOREIGN KEY (location_id) REFERENCES location (id)
  );