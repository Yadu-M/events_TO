import { insert, resetDb } from '../../db/utils';
import { extractCost, extractDate, extractEvent, extractLocation, extractReservation, extractWeeklyDate } from '../../lib/extract';
import {
	costTableSchema,
	dateTableSchema,
	eventTableSchema,
	locationTableSchema,
	reservationTableSchema,
	weeklyDateTableSchema,
} from '../../db/schema';
import { fetchEventData, parseData } from '../../lib/helpers';

export async function updateDbHandler(DB: D1Database, URL: string) {
	const data = await fetchEventData(URL);
	const parsedData = parseData(data as { calEvent: any }[]);
	// Drops every table
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

	const statements: D1PreparedStatement[] = [];
	if (dateStmts.length > 0) statements.push(...dateStmts);
	if (weeklyDateStmts.length > 0) statements.push(...weeklyDateStmts);
	if (locationStmts.length > 0) statements.push(...locationStmts);
	if (costStmts.length > 0) statements.push(...costStmts);
	if (reservationStmts.length > 0) statements.push(...reservationStmts);

	const results = await Promise.all(await DB.batch(statements));
	const result = results.some((result) => !result.error);

	return result ? new Response('Success', { status: 200 }) : new Response('failed to update database', { status: 500 });
}
