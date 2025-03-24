export async function deleteKVHandler(KV: KVNamespace) {
	const allKeys = await KV.list();
  console.log(allKeys)
	await Promise.all(allKeys.keys.map(async ({ name }) => await KV.delete(name)));
	return new Response('Success');
}
