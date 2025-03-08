import { insert, resetDb } from './db';
import { extractCost, extractDate, extractEvent, extractLocation, extractReservation, extractWeeklyDate } from './extract';
import { fetchEventData, parseData } from './helpers';
import {
	costTableSchema,
	dateTableSchema,
	eventTableSchema,
	locationTableSchema,
	reservationTableSchema,
	weeklyDateTableSchema,
} from './schema';

export async function updateDb(DB: D1Database, apiBaseUrl: string) {
	const data = await fetchEventData(apiBaseUrl);
	const parsedData = parseData(data as { calEvent: any }[]);

	// Reset DB
	await resetDb(DB);

	// Initialize insert functions
	const insertEvent = insert(DB)(eventTableSchema);
	const insertDate = insert(DB)(dateTableSchema);
	const insertWeeklyDate = insert(DB)(weeklyDateTableSchema);
	const insertLocation = insert(DB)(locationTableSchema);
	const insertCost = insert(DB)(costTableSchema);
	const insertReservation = insert(DB)(reservationTableSchema);

	// Generate statements for each table
	const eventStmts = parsedData.map((event) => insertEvent(extractEvent(event))).filter((stmt) => stmt !== null);
	const dateStmts = parsedData.map((event) => insertDate(extractDate(event, event.id))).filter((stmt) => stmt !== null);
	const weeklyDateStmts = parsedData.map((event) => insertWeeklyDate(extractWeeklyDate(event, event.id))).filter((stmt) => stmt !== null);
	const locationStmts = parsedData.map((event) => insertLocation(extractLocation(event, event.id))).filter((stmt) => stmt !== null);
	const costStmts = parsedData.map((event) => insertCost(extractCost(event, event.id))).filter((stmt) => stmt !== null);
	const reservationStmts = parsedData
		.map((event) => insertReservation(extractReservation(event, event.id)))
		.filter((stmt) => stmt !== null);

	// Insert events first (parent table)
	if (eventStmts.length > 0) {
		await DB.batch(eventStmts);
	}

	// Then insert dependent tables (order doesn’t matter among these)
	await Promise.all(
		[
			dateStmts.length > 0 && DB.batch(dateStmts),
			weeklyDateStmts.length > 0 && DB.batch(weeklyDateStmts),
			locationStmts.length > 0 && DB.batch(locationStmts),
			costStmts.length > 0 && DB.batch(costStmts),
			reservationStmts.length > 0 && DB.batch(reservationStmts),
		].filter(Boolean)
	);

	return new Response('Success', { status: 200 });
}
