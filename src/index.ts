import { getGeoJSON_Handler } from './api/handlers/geojson';
import { updateDb } from './api/updateDB';

export default {
	async fetch(request, env): Promise<Response> {
		const { pathname, searchParams } = new URL(request.url);
		const authHeader = request.headers.get('Authorization');

		if (!authHeader || authHeader !== `Bearer ${env.API_TOKEN}`) return new Response('Unauthorized Access', { status: 401 });

		if (request.method === 'POST' && pathname === '/api/updateDb') {
			return await updateDb(env.DB, env.CITY_API_BASE_URL);
		}

		if (request.method === 'GET') {
			switch (pathname) {
				case '/api/geojson':
					return await getGeoJSON_Handler(env.DB, searchParams);

				default:
					break;
			}
		}

		return new Response('Invalid api call', { status: 400 });
	},
} satisfies ExportedHandler<Env>;
