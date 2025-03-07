import { ZodObject, ZodSchema } from 'zod';
import { D1Database } from '@cloudflare/workers-types';
import { isEmpty } from './helpers';

export async function resetDb(DB: D1Database) {
	await DB.prepare(
		`
    DROP TABLE IF EXISTS date;
    DROP TABLE IF EXISTS weeklyDate;
    DROP TABLE IF EXISTS location;
    DROP TABLE IF EXISTS cost;
    DROP TABLE IF EXISTS image;
    DROP TABLE IF EXISTS reservation;    
    DROP TABLE IF EXISTS event;

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
        allDay                TINYTEXT,
        startDate             DATETIME NOT NULL,
        endDate               DATETIME NOT NULL,  

        FOREIGN KEY (eventId) REFERENCES event (id)
      );

    CREATE TABLE
      weeklyDate (
        id                    INTEGER PRIMARY KEY AUTOINCREMENT,
        eventId               INTEGER NOT NULL,
        day                   TINYTEXT,
        startTime             DATETIME,
        endTime               DATETIME,

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
        eventId               INTEGER NOT NULL,
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
  `
	).run();
}

export function insert(db: D1Database) {
	// Helper to build SQL INSERT query
	function queryBuilder(keys: string[], table: string): string {
		const separatedKeys = keys.join(',');
		const placeholders = keys.map(() => '?').join(',');
		return `INSERT INTO ${table} (${separatedKeys}) VALUES (${placeholders})`;
	}

	return (table: ZodSchema) => {
		// Cast the schema to ZodObject to access shape
		const tableObject = table as ZodObject<any>;
		const tableShape = tableObject.shape;
		const tableKeys = Object.keys(tableShape);

		// Fallback table name (adjust as needed)
		const tableName = table._def.description!

		return async (obj: object) => {
			if (isEmpty(obj)) return;

			// Map the event object keys to the table schema keys
			const values: any[] = [];
			const mappedKeys: string[] = [];

			for (const key of tableKeys) {
				if (key === 'eventId') {
					// Special case: map eventId to the 'id' from the event object
					mappedKeys.push('eventId');
					values.push((obj as any).eventId); // Assuming 'id' exists in the event object
				} else if (key in obj) {
					// Only include keys that exist in both the table schema and the event object
					mappedKeys.push(key);
					values.push((obj as any)[key] ?? null);
				}
			}

			if (mappedKeys.length === 0) {
				throw new Error(`No matching keys found for table ${tableName}`);
			}

			const query = queryBuilder(mappedKeys, tableName);

			try {
				await db
					.prepare(query)
					.bind(...values)
					.run();
			} catch (error) {
				throw new Error(`Failed to insert into ${tableName}: ${(error as Error).message}`);
			}
		};
	};
}
