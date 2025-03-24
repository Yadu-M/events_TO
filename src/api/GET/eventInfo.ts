import { z } from 'zod';
import { getCostInfo, getDateInfo, getEventInfo } from '../../db/queries';

export async function eventInfoHandler(db: D1Database, params: URLSearchParams) {
	const eventIdParam = params.get('id');
	if (!eventIdParam) return new Response('Invalid request, missing id', { status: 405 });

	const eventId = z.coerce.number().safeParse(eventIdParam);
	if (!eventId.success) return new Response('Invalid request, not a valid id', { status: 405 });

	const payload = {
		event: await getEventInfo(db, eventId.data),
		date: await getDateInfo(db, eventId.data),
		cost: await getCostInfo(db, eventId.data),
	};

  console.log(typeof await getEventInfo(db, eventId.data))

	return new Response(JSON.stringify(payload), { headers: { 'Content-Type': 'Application/Json' } });
}
