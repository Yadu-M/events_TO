export async function getR2RequestHandler(r2: R2Bucket) {
	const objects = (await r2.list()).objects;
	if (objects.length === 0) return new Response('No r2 objects found');
	return new Response(JSON.stringify((await r2.list()).objects), { headers: { 'Content-Type': 'application/json' } });
}
