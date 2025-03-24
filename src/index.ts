import { deleteKVHandler } from './api/DELETE/kv';
import { deleteR2Handler } from './api/DELETE/r2';
import { getEventHandler } from './api/GET/event';
import { eventInfoHandler } from './api/GET/eventInfo';
import { getGeoJSONHandler } from './api/GET/geojson';
import { getImageHandler } from './api/GET/image';
import { getKVHandler } from './api/GET/kv';
import { getR2RequestHandler } from './api/GET/r2';
import { cacheImageHander } from './api/POST/cacheImage';
import { updateDbHandler } from './api/POST/d1';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const { pathname, searchParams } = new URL(request.url);
		const authHeader = request.headers.get('Authorization');
		const host = request.headers.get('host')!;

		// if (!authHeader || authHeader !== `Bearer ${env.API_TOKEN}`) return new Response('Unauthorized Access', { status: 401 });

		switch (request.method) {
			case 'GET':
				// Fetch image from local r2 if local request
				const fileResponse = await getImageHandler(env.R2, pathname);
				if (fileResponse) return fileResponse;

				switch (pathname) {
					case '/geojson':
						return await getGeoJSONHandler(env, searchParams, host.includes('localhost'));
					case '/event':
						return await getEventHandler(env.DB, searchParams);
					case '/kv':
						return await getKVHandler(env.KV);
					case '/r2':
						return await getR2RequestHandler(env.R2);
					case '/eventInfo':
						return eventInfoHandler(env.DB, searchParams);
					default:
						return new Response('Invalid get request', { status: 405 });
				}

			case 'POST':
				if (!authHeader || authHeader !== `Bearer ${env.API_TOKEN}`) return new Response('Unauthorized Access', { status: 401 });
				
				switch (pathname) {
					case '/d1':
						return await updateDbHandler(env.DB, env.CITY_API_BASE_URL);
					case '/cacheClusterImages':
						return await cacheImageHander(env);
					default:
						return new Response('Invalid post request', { status: 405 });
				}

			case 'DELETE':
				switch (pathname) {
					case '/kv':
						return await deleteKVHandler(env.KV);
					case '/r2':
						return await deleteR2Handler(env.R2);
					default:
						return new Response('Invalid delete request', { status: 405 });
				}
			default:
				break;
		}

		return new Response('Invalid api call', { status: 405 });
	},
} satisfies ExportedHandler<Env>;
