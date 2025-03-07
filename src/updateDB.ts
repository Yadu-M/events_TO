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

export async function updateDb(DB: D1Database, apiBaseUrl: string): Promise<void> {
  const data = await fetchEventData(apiBaseUrl);
  const parsedData = parseData(data as { calEvent: any }[]);

  // Reset DB
  await resetDb(DB);

  await Promise.all(
    parsedData.map(async (event) => {
      const id = event.id;
      await insert(DB)(eventTableSchema)(extractEvent(event));
      await insert(DB)(dateTableSchema)(extractDate(event, id));
      await insert(DB)(weeklyDateTableSchema)(extractWeeklyDate(event, id));
      await insert(DB)(locationTableSchema)(extractLocation(event, id));
      await insert(DB)(costTableSchema)(extractCost(event, id));
      await insert(DB)(reservationTableSchema)(extractReservation(event, id));
    })
  );
}