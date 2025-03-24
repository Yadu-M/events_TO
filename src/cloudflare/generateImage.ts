export async function generateClusterImage(env: Env, locationName: string): Promise<string> {
	try {
		const response = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
			prompt: `A thumbnail fitting of ${locationName}`,
			steps: 2
		});

		response.image;

		// Check response format (adjust based on actual output)
		let imageData: Uint8Array;
		if (response.image && typeof response.image === 'string') {
			// Base64 case
			const binaryString = atob(response.image);
			imageData = Uint8Array.from(binaryString, (m) => m.codePointAt(0)!);
		} else if (response instanceof Uint8Array) {
			// Direct binary case
			imageData = response;
		} else {
			throw new Error('Unexpected image format from AI');
		}

		const r2Key = `clusters/${locationName}-${Date.now()}.png`;
		await env.R2.put(r2Key, imageData, {
			httpMetadata: { contentType: 'image/png' },
		});

		return `${env.R2_BASE_URL}${r2Key}`; // Replace with your R2 domain
	} catch (error) {
		throw new Error(`Image generation failed for ${locationName}: ${(error as Error).message || 'Unknown error'}`);
	}
}
