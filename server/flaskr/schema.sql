DROP TABLE IF EXISTS event;

DROP TABLE IF EXISTS date;

DROP TABLE IF EXISTS weeklyDate;

DROP TABLE IF EXISTS location;

DROP TABLE IF EXISTS cost;

DROP TABLE IF EXISTS image;

DROP TABLE IF EXISTS reservation;

CREATE TABLE
  event (
    id                    INTEGER PRIMARY KEY,
    eventName             TINYTEXT NOT NULL,
    eventWebsite          TINYTEXT,
    eventEmail            TINYTEXT,
    eventPhone            TINYTEXT,
    eventPhoneExt         TINYTEXT,
    partnerType           TINYTEXT,
    partnerName           TINYTEXT,
    expectedAvg           INTEGER,
    accessibility         TINYTEXT NOT NULL,
    frequency             TINYTEXT NOT NULL,
    startDate             DATETIME NOT NULL,
    endDate               DATETIME NOT NULL,
    timeInfo              TINYTEXT,
    freeEvent             TINYTEXT NOT NULL,
    orgName               TINYTEXT NOT NULL,
    contactName           TINYTEXT NOT NULL,
    contactTitle          TINYTEXT,
    orgAddress            TINYTEXT NOT NULL,
    orgPhone              TINYTEXT NOT NULL,
    orgPhoneExt           TINYTEXT,
    orgFax                TINYTEXT,
    orgEmail              TINYTEXT NOT NULL,
    orgType               TINYTEXT,
    orgTypeOther          TINYTEXT,
    categoryString        TINYTEXT NOT NULL,
    description           TINYTEXT NOT NULL,
    allDay                TINYTEXT,
    reservationsRequired  TINYTEXT NOT NULL,
    features              TINYTEXT
  );


CREATE TABLE
  date (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    eventId               INTEGER NOT NULL,
    allDay                TINYTEXT NOT NULL,
    startDateTime         DATETIME NOT NULL,
    endDateTime           DATETIME NOT NULL,  

    FOREIGN KEY (eventId) REFERENCES event (id)
  );

CREATE TABLE
  weeklyDate (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    eventId               INTEGER NOT NULL,
    day                   TINYTEXT NOT NULL,
    startTime             DATETIME NOT NULL,
    endTime               DATETIME NOT NULL,
    description           TINYTEXT NOT NULL,

    FOREIGN KEY (eventId) REFERENCES event (id)
  );


CREATE TABLE
  location (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    eventId               INTEGER NOT NULL,
    lat                   INTEGER NOT NULL,
    lng                   INTEGER NOT NULL,
    locationName          TINYTEXT NOT NULL,
    address               TINYTEXT,    
    displayAddress        TINYTEXT,

    FOREIGN KEY (eventId) REFERENCES event (id)
  );


CREATE TABLE
  cost (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    eventId               INTEGER,
    child                 INTEGER,
    youth                 INTEGER,
    student               INTEGER,
    adult                 INTEGER,
    senior                INTEGER,
    _from                 INTEGER,
    _to                   INTEGER,
    generalAdmission      INTEGER,

    FOREIGN KEY (eventId) REFERENCES event (id)
  );


CREATE TABLE
  image (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    eventId               INTEGER NOT NULL,
    fileName              TINYTEXT,
    fileSize              TINYTEXT,
    fileType              TINYTEXT,
    altText               TINYTEXT NOT NULL,
    credit                TINYTEXT,
    url                   TINYTEXT NOT NULL,
    file                  BLOB NOT NULL,
    thumbNail             BLOB NOT NULL,

    FOREIGN KEY (eventId) REFERENCES event (id)
  );


CREATE TABLE
  reservation (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    eventId               INTEGER NOT NULL,
    website               TINYTEXT,
    phone                 TINYTEXT,
    phoneExt              TINYTEXT,
    email                 TINYTEXT,
    FOREIGN KEY (eventId) REFERENCES event (id)
  );
