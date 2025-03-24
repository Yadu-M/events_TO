export async function getImageHandler(r2: R2Bucket, pathName: string) {
	const key = decodeURI(pathName.substring(1));
	const response = await r2.get(key);

	if (response) {
		const headers = new Headers();
		headers.set('Content-Type', response.httpMetadata?.contentType || 'application/octet-stream');
		return new Response(response.body, { headers });
	}
}
