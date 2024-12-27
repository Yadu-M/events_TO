DROP TABLE IF EXISTS event;

DROP TABLE IF EXISTS feature;

DROP TABLE IF EXISTS date;

DROP TABLE IF EXISTS weeklyDate;

DROP TABLE IF EXISTS location;

DROP TABLE IF EXISTS cost;

DROP TABLE IF EXISTS image;

CREATE TABLE
  event (
    id                  INTEGER PRIMARY KEY,
    eventName           TINYTEXT NOT NULL,
    eventWebsite        TINYTEXT NOT NULL,
    eventEmail          TINYTEXT NOT NULL,
    eventPhone          TINYTEXT NOT NULL,
    eventPhoneExt       TINYTEXT NOT NULL,
    partnerType         TINYTEXT NOT NULL,
    partnerName         TINYTEXT NOT NULL,
    expectedAvg         INTEGER,
    accessibility       TINYTEXT NOT NULL,
    frequency           TINYTEXT NOT NULL,
    startDate           DATETIME NOT NULL,
    endDate             DATETIME NOT NULL,
    timeInfo            TINYTEXT NOT NULL,
    freeEvent           TINYTEXT NOT NULL,
    orgName             TINYTEXT NOT NULL,
    contactName         TINYTEXT NOT NULL,
    contactTitle        TINYTEXT NOT NULL,
    orgAddress          TINYTEXT NOT NULL,
    orgPhone            TINYTEXT NOT NULL,
    orgPhoneExt         TINYTEXT NOT NULL,
    orgFax              TINYTEXT NOT NULL,
    orgEmail            TINYTEXT NOT NULL,
    orgType             TINYTEXT NOT NULL,
    orgTypeOther        TINYTEXT NOT NULL,
    categoryString      TINYTEXT NOT NULL,
    description         TINYTEXT NOT NULL,
    allDay              TINYTEXT NOT NULL
  );


CREATE TABLE
  feature (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    eventId             INTEGER NOT NULL,
    features            TINYTEXT,
    
    FOREIGN KEY (eventId) REFERENCES event (id)
  );


CREATE TABLE
  date (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    eventId             INTEGER NOT NULL,
    allDay              TINYTEXT NOT NULL,
    startDateTime       DATETIME NOT NULL,
    endDateTime         DATETIME NOT NULL,

    FOREIGN KEY (eventId) REFERENCES event (id)
  );

CREATE TABLE
  weeklyDate (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    eventId             INTEGER NOT NULL,
    day                 TINYTEXT NOT NULL,
    startTime           DATETIME NOT NULL,
    endTime             DATETIME NOT NULL,
    description         TINYTEXT NOT NULL,

    FOREIGN KEY (eventId) REFERENCES event (id)
  );


CREATE TABLE
  location (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    eventId             INTEGER NOT NULL,
    lat                 INTEGER NOT NULL,
    lng                 INTEGER NOT NULL,
    locationName        TINYTEXT NOT NULL,
    address             TINYTEXT NOT NULL,    
    displayAddress      TINYTEXT NOT NULL,

    FOREIGN KEY (eventId) REFERENCES event (id)
  );


CREATE TABLE
  cost (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    eventId             INTEGER,
    child               INTEGER,
    youth               INTEGER,
    student             INTEGER,
    adult               INTEGER,
    senior              INTEGER,
    fromT               INTEGER,
    toT                 INTEGER,

    FOREIGN KEY (eventId) REFERENCES event (id)
  );


CREATE TABLE
  image (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    eventId             INTEGER NOT NULL,
    fileName            TINYTEXT,
    fileSize            TINYTEXT,
    fileType            TINYTEXT,
    altText             TINYTEXT NOT NULL,
    credit              TINYTEXT,
    url                 TINYTEXT NOT NULL,
    file                BLOB NOT NULL,
    thumbNail           BLOB NOT NULL,

    FOREIGN KEY (eventId) REFERENCES event (id)
  );
