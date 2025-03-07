import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Update database', () => {
	it('Updates the database', async () => {
		const request = new IncomingRequest('http://example.com/api/updateDb', { method: "POST" });
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
		expect(await response.text()).toBe('Success');
	});
});
