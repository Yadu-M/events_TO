import { FeatureCollection } from "geojson";

export interface ClusterFeatureCollection extends FeatureCollection {
	clusterImageUri?: string;
}