export async function deleteR2Handler(r2: R2Bucket) {
	try {
		const r2Objects = (await r2.list()).objects;
		await r2.delete(r2Objects.map((object) => object.key));
	} catch (error) {
		return new Response('Something went wrong while trying to delete r2 bucket', {
			status: 500,
		});
	}

	return new Response('Success');
}
