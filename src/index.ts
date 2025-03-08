import { updateDb } from './updateDB';

export default {
	async fetch(request, env, ctx: ExecutionContext): Promise<Response> {
		const { pathname } = new URL(request.url);
		const DB = env.DB;

		if (request.method === 'POST' && pathname === '/api/updateDb') {
			try {
				return updateDb(DB, env.CITY_API_BASE_URL);
			} catch (error) {
				console.log(error);
				return new Response((error as Error).message, { status: 500 });
			}
		}

		return new Response('Invalid api call', {
			status: 400,
			statusText: 'OK',
		});
	},
} satisfies ExportedHandler<Env>;
