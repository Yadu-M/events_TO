import { z } from 'zod';
import { eventPayloadSchema } from '../db/schema';

export async function fetchEventData(baseURL: string) {
	const params = { id: 'festivals-events' };
	const response = await fetch(baseURL, { headers: params });
	if (!response.ok) return null;
	return await response.json();
}

function sanitizeData(event: object) {
	if ('dates' in event) {
		if (Array.isArray(event['dates'])) {
			event['dates'] = event['dates'].map((dateObj: { string: any }) => {
				const cond1 = 'startDateTime' in dateObj ? dateObj['startDateTime'] : null;
				const cond2 = 'endDateTime' in dateObj ? dateObj['endDateTime'] : null;
				if (cond1 === null && cond2 === null) return {};

				return {
					startDateTime: cond1,
					endDateTime: cond2,
				};
			});
		}
	}

	if ('weeklyDates' in event) {
		if (Array.isArray(event['weeklyDates'])) {
			event['weeklyDates'] =
				event['weeklyDates'] &&
				event['weeklyDates'].map((dateObj: object) => {
					const cond1 = 'startTime' in dateObj ? dateObj['startTime'] : null;
					const cond2 = 'endTime' in dateObj ? dateObj['endTime'] : null;
					const cond3 =
						'weekDay' in dateObj
							? Array.isArray(dateObj['weekDay'])
								? 'day' in dateObj['weekDay'][0]
									? dateObj['weekDay'][0]['day']
									: null
								: null
							: null;

					return {
						startTime: cond1,
						endTime: cond2,
						weekDay: cond3,
					};
				});
		}
	}

	if ('locations' in event) {
		if (Array.isArray(event['locations'])) {
			event['locations'] = event['locations'].filter((locationObj: object) => 'type' in locationObj && locationObj['type'] === 'marker');
		}
	}
}

export function parseData(data: { calEvent: any }[]) {
	const parsedData: z.infer<typeof eventPayloadSchema>[] = [];

	for (const [index, eventObj] of data.entries()) {
		const event = { ...eventObj['calEvent'], id: index };

		sanitizeData(event);
		const result = eventPayloadSchema.safeParse(event);

		if (result.success) parsedData.push(result.data);
		else console.log(result.error.errors);
	}

	return parsedData;
}

export function isEmpty(obj: object) {
	for (const _ in obj) return false;
	return true;
}
