import { D1Database } from '@cloudflare/workers-types';

export function getLocations(db: D1Database, date = new Date()) {
	return db
		.prepare(
			`
    SELECT location.*
    FROM location
    INNER JOIN date ON location.eventId = date.eventId
    WHERE date.startDate > ?
    ORDER BY date.startDate ASC
  `
		)
		.bind(date.toISOString());
}
