import { FeatureCollection } from 'geojson';
import { getLocations } from '../../db/queries';
import { locationTableSchema } from '../../db/schema';
import { z } from 'zod';

export async function getGeoJSON_Handler(db: D1Database, params: URLSearchParams) {
	const dateString = params.get('date');
	const date = dateString && !isNaN(new Date(dateString).valueOf()) ? new Date(dateString) : new Date();

	type resultT = z.infer<typeof locationTableSchema>[];
	const results = (await getLocations(db, date).all()).results as resultT;

	const featureCollection: FeatureCollection = {
		type: 'FeatureCollection',
		features: results.map((location) => {
			const { lat, lng } = location;

			return {
				type: 'Feature',
				properties: location,
				geometry: {
					coordinates: [lng, lat],
					type: 'Point',
				},
			};
		}),
	};

	return new Response(JSON.stringify(featureCollection), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}
