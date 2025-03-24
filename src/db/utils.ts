import { ZodObject, ZodSchema } from 'zod';
import { D1Database } from '@cloudflare/workers-types';
import { isEmpty } from '../lib/helpers';

export async function resetDb(DB: D1Database) {
	await DB.prepare(
		`
    DROP TABLE IF EXISTS reservation;
    DROP TABLE IF EXISTS image;
    DROP TABLE IF EXISTS cost;
    DROP TABLE IF EXISTS location;
    DROP TABLE IF EXISTS weeklyDate;
    DROP TABLE IF EXISTS event_date; -- Renamed from "date"
    DROP TABLE IF EXISTS event;

    CREATE TABLE
      event (
        id                    INTEGER PRIMARY KEY,
        eventName             TEXT NOT NULL,
        eventWebsite          TEXT,
        eventEmail            TEXT,
        eventPhone            TEXT,
        eventPhoneExt         TEXT,
        partnerType           TEXT,
        partnerName           TEXT,
        expectedAvg           INTEGER,
        accessibility         TEXT NOT NULL,
        frequency             TEXT NOT NULL,
        startDate             TEXT NOT NULL, -- Changed to TEXT for SQLite
        endDate               TEXT NOT NULL, -- Changed to TEXT for SQLite
        timeInfo              TEXT,
        freeEvent             TEXT NOT NULL,
        orgName               TEXT NOT NULL,
        contactName           TEXT NOT NULL,
        contactTitle          TEXT,
        orgAddress            TEXT NOT NULL,
        orgPhone              TEXT NOT NULL,
        orgPhoneExt           TEXT,
        orgEmail              TEXT NOT NULL,
        orgType               TEXT,
        orgTypeOther          TEXT,
        categoryString        TEXT NOT NULL,
        description           TEXT NOT NULL,
        allDay                TEXT, -- Consider if this is needed here
        reservationsRequired  TEXT NOT NULL,
        features              TEXT
      );

    CREATE TABLE
      event_date (
        id                    INTEGER PRIMARY KEY AUTOINCREMENT,
        eventId               INTEGER NOT NULL,
        allDay                TEXT,
        startDate             TEXT NOT NULL,
        endDate               TEXT NOT NULL,  
        FOREIGN KEY (eventId) REFERENCES event (id)
      );

    CREATE TABLE
      weeklyDate (
        id                    INTEGER PRIMARY KEY AUTOINCREMENT,
        eventId               INTEGER NOT NULL,
        day                   TEXT,
        startTime             TEXT, -- Changed to TEXT for SQLite
        endTime               TEXT, -- Changed to TEXT for SQLite
        FOREIGN KEY (eventId) REFERENCES event (id)
      );

    CREATE TABLE
      location (
        id                    INTEGER PRIMARY KEY AUTOINCREMENT,
        eventId               INTEGER NOT NULL,
        lat                   REAL NOT NULL, -- Changed to REAL for decimals
        lng                   REAL NOT NULL, -- Changed to REAL for decimals
        locationName          TEXT NOT NULL,
        address               TEXT,    
        displayAddress        TEXT,
        thumbnailUrl          TEXT,
        imageUrl              TEXT,
        imageAlText           TEXT,

        FOREIGN KEY (eventId) REFERENCES event (id)
      );

    CREATE TABLE
      cost (
        id                    INTEGER PRIMARY KEY AUTOINCREMENT,
        eventId               INTEGER NOT NULL,
        child                 INTEGER,
        youth                 INTEGER,
        student               INTEGER,
        adult                 INTEGER,
        senior                INTEGER,
        priceFrom             INTEGER, -- Renamed from "_from"
        priceTo               INTEGER, -- Renamed from "_to"
        generalAdmission      INTEGER,
        FOREIGN KEY (eventId) REFERENCES event (id)
      );

    CREATE TABLE
      image (
        id                    INTEGER PRIMARY KEY AUTOINCREMENT,
        eventId               INTEGER NOT NULL,
        fileName              TEXT,
        fileSize              TEXT,
        fileType              TEXT,
        altText               TEXT NOT NULL,
        credit                TEXT,
        url                   TEXT NOT NULL,
        file                  BLOB NOT NULL, -- Consider if this is needed with url
        thumbNail             BLOB NOT NULL, -- Consider if this is needed with url
        FOREIGN KEY (eventId) REFERENCES event (id)
      );

    CREATE TABLE
      reservation (
        id                    INTEGER PRIMARY KEY AUTOINCREMENT,
        eventId               INTEGER NOT NULL,
        website               TEXT,
        phone                 TEXT,
        phoneExt              TEXT,
        email                 TEXT,
        FOREIGN KEY (eventId) REFERENCES event (id)
      );
  `
	).run();
}

export function insert(db: D1Database) {
	function queryBuilder(keys: string[], table: string): string {
		const separatedKeys = keys.join(',');
		const placeholders = keys.map(() => '?').join(',');
		return `INSERT INTO ${table} (${separatedKeys}) VALUES (${placeholders})`;
	}

	return (table: ZodSchema) => {
		const tableObject = table as ZodObject<any>;
		const tableShape = tableObject.shape;
		const tableKeys = Object.keys(tableShape);
		const tableName = table._def.description || 'default_table';

		return (obj: object) => {
			if (isEmpty(obj)) return null;

			const values: any[] = [];
			const mappedKeys: string[] = [];

			for (const key of tableKeys) {
				if (key === 'eventId') {
					mappedKeys.push('eventId');
					values.push((obj as any).eventId);
				} else if (key in obj) {
					mappedKeys.push(key);
					values.push((obj as any)[key] ?? null);
				}
			}

			if (mappedKeys.length === 0) {
				throw new Error(`No matching keys found for table ${tableName}`);
			}

			const query = queryBuilder(mappedKeys, tableName);
			return db.prepare(query).bind(...values);
		};
	};
}
