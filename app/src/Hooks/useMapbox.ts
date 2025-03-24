import mapboxgl from 'mapbox-gl';
import { useRef, useState, useEffect } from 'react';

export const useMapbox = (containerRef: React.RefObject<HTMLDivElement>) => {
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const [mapLoaded, setMapLoaded] = useState(false);

	useEffect(() => {
		const accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;
		if (!accessToken) {
			alert('Mapbox access token not initialized');
			return;
		}

		mapboxgl.accessToken = accessToken;

		if (!containerRef.current) {
			console.error('Map container not initialized');
			return;
		}

		const map = new mapboxgl.Map({
			container: containerRef.current,
			center: [-79.347015, 43.65107],
			zoom: 10.5,
			pitch: 62,
			bearing: -20,
		});

		mapRef.current = map;
		map.on('load', () => setMapLoaded(true));

		return () => map.remove();
	}, []);

	return { map: mapRef.current, mapLoaded };
};
