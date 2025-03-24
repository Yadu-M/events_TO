export async function getKVHandler(kv: KVNamespace) {
	const keys = (await kv.list()).keys;
	if (keys.length === 0) return new Response('Empty keys');
	return new Response(JSON.stringify((await kv.list()).keys), { headers: { 'Content-Type': 'application/json' } });
}
