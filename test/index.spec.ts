import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;
const baseURL = 'http://localhost:8787'

describe('Authorization', () => {
	it ('Verified auth', async () => {
		const request = new IncomingRequest(baseURL, {
			method: 'GET',
			headers: { Authorization: `Bearer ${env.API_TOKEN}` },
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env);
		await waitOnExecutionContext(ctx);		
		expect(await response.text()).toBe('Invalid api call');
		expect(response.status).toBe(400)
	})	
})

describe('Update database', () => {
	it('Updates the database', async () => {
		const request = new IncomingRequest(`${baseURL}/api/updateDb`, {
			method: 'POST',
			headers: { Authorization: `Bearer ${env.API_TOKEN}` },
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env);
		await waitOnExecutionContext(ctx);
		expect(await response.text()).toBe('Success');
	});
});
