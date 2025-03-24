import { generateClusterImage } from '../../cloudflare/generateImage';
import { ClusterFeatureCollection } from '../../types';
import { deleteKVHandler } from '../DELETE/kv';
import { deleteR2Handler } from '../DELETE/r2';
import { getGeoJSONHandler } from '../GET/geojson';

export async function cacheImageHander(env: Env) {
	await deleteKVHandler(env.KV);
	await deleteR2Handler(env.R2);

	const geoJsonKV = (await getGeoJSONHandler(env, new URLSearchParams()).then((res) => res.json())) as Record<
		string,
		ClusterFeatureCollection
	>;

	const totalClusterCount = Object.keys(geoJsonKV).length;
	let clusterCount = 0;
	let addedClusters = 0;

	for (const [key, value] of Object.entries(geoJsonKV)) {
		// Generate image for clusters (>1 event)
		const events = value.features;
		const canonicalName = key;

		if (events.length > 1) {
			clusterCount++;
			const kvKey = `cluster-img:${canonicalName}`;
			let uri = await env.KV.get(kvKey);
			if (!uri) {
				try {
					uri = await generateClusterImage(env, canonicalName);
					await env.KV.put(kvKey, uri, { expirationTtl: 7 * 24 * 60 * 60 }); // Cache for 1 day
					addedClusters++;
				} catch (error) {
          const errorMessage = `Failed to generate image for ${canonicalName}: ${error}`
					console.error(errorMessage);
					uri = '/map-marker-cluster.png'; // Fallback
				}
			}
		}
	}

	return new Response(
		`TotalClusters: ${totalClusterCount}\nMulti feature Clusters: ${clusterCount}\nCluster Images added: ${addedClusters}`
	);
}
