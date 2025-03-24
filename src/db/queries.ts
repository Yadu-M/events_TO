import { D1Database } from '@cloudflare/workers-types';
import { z } from 'zod';
import { costTableSchema, dateTableSchema, eventTableSchema, locationTableSchema } from './schema';

type location = z.infer<typeof locationTableSchema>;
type event = z.infer<typeof eventTableSchema>;
type date = z.infer<typeof dateTableSchema>;
type cost = z.infer<typeof costTableSchema>;

export async function getLocations(db: D1Database, date = new Date()): Promise<location[]> {
	const query = `
    SELECT location.*
    FROM location
    INNER JOIN event_date ON location.eventId = event_date.eventId
    WHERE event_date.startDate > ?
    ORDER BY event_date.startDate ASC
  `;

	return (await db.prepare(query).bind(date.toISOString()).all()).results as location[];
}

export async function getEventInfo(db: D1Database, eventId: number): Promise<event> {
	const query = `
    SELECT event.*
    FROM event
    WHERE event.id = ?
  `;

	return (await db.prepare(query).bind(eventId).first()) as event;
}

export async function getDateInfo(db: D1Database, eventId: number): Promise<date> {
	const query = `
    SELECT event_date.*
    FROM event_date
    WHERE event_date.eventId = ?
  `;

	return (await db.prepare(query).bind(eventId).first()) as date;
}

export async function getCostInfo(db: D1Database, eventId: number): Promise<cost> {
	const query = `
    SELECT cost.*
    FROM cost
    WHERE cost.eventId = ?
  `;

	return (await db.prepare(query).bind(eventId).first()) as cost;
}
