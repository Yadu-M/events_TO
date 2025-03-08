import { fetchEventData, parseData } from './helpers';
import { updateDb } from './updateDB';

export default {
	async fetch(request, env): Promise<Response> {
		const { pathname } = new URL(request.url);
		const authHeader = request.headers.get('Authorization');
		const DB = env.DB;

		if (!authHeader || authHeader !== `Bearer ${env.API_TOKEN}`) return new Response('Unauthorized Access', { status: 401 });

		if (request.method === 'POST') {
			const data = await fetchEventData(env.CITY_API_BASE_URL);
			const parsedData = parseData(data as { calEvent: any }[]);
			switch (pathname) {
				case '/api/updateDb':
					console.log('wtf')
					try {
						const result = await updateDb(DB, parsedData);
						if (!result) throw new Error('failed to update database');

						return new Response('Success', { status: 200 });
					} catch (error) {
						console.log(error);
						return new Response((error as Error).message, { status: 500 });
					}
				default:
					break
			}
		}

		if (request.method === 'GET') {
			switch (pathname) {
				case '':
					break;

				default:
					break
			}
		}

		return new Response('Invalid api call', { status: 400 });
	},
} satisfies ExportedHandler<Env>;
