import { getLocations } from '../../db/queries';
import { ClusterFeatureCollection } from '../../types';

export async function getGeoJSONHandler(env: Env, params: URLSearchParams, isLocal: boolean = false) {
	const dateString = params.get('date');
	const date = dateString && !isNaN(new Date(dateString).valueOf()) ? new Date(dateString) : new Date();
	const locations = await getLocations(env.DB, date);

	// Step 1: Group by coordinates
	const coordGrouped: Record<string, typeof locations> = {};
	locations.forEach((result) => {
		const coordKey = `${result.lng},${result.lat}`;
		if (!coordGrouped[coordKey]) coordGrouped[coordKey] = [];
		coordGrouped[coordKey].push(result);
	});

	const KV: Record<string, ClusterFeatureCollection> = {};
	for (const [coordKey, events] of Object.entries(coordGrouped)) {
		const canonicalName = events.find((e) => e.locationName)?.locationName || coordKey;
		const featureCollection: ClusterFeatureCollection = {
			type: 'FeatureCollection',
			features: events.map((result) => ({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [result.lng, result.lat],
				},
				properties: result,
			})),
		};

		const uri = await env.KV.get(`cluster-img:${canonicalName}`);

		if (uri) {
			featureCollection.clusterImageUri = isLocal ? `http://localhost:8787/${uri.substring(22)}` : uri;
		}

		KV[canonicalName] = featureCollection;
	}

	return new Response(JSON.stringify(KV), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}
