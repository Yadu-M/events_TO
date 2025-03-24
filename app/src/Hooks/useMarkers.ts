import { useCallback, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { ClusterFeatureCollection, GeoJsonPayload } from '../types';

export const useMarkers = (
	map: mapboxgl.Map | null,
	setActiveCluster: React.Dispatch<React.SetStateAction<ClusterFeatureCollection | null>>
) => {
	const markersRef = useRef<mapboxgl.Marker[]>([]);

	const displayMarkers = useCallback(
		(data: GeoJsonPayload) => {
			if (!map) return;

			markersRef.current.forEach((marker) => {
				marker.getElement().removeEventListener('click', marker.getElement().onclick as any);
				marker.remove();
			});
			markersRef.current = [];

			for (const value of Object.values(data)) {
				const el = document.createElement('div');
				const features = value.features;
				const isCluser = features.length > 1;
				const [{ geometry }] = features;

				el.className = 'marker';
				el.style.backgroundSize = '100%';
				el.style.display = 'block';
				el.style.borderRadius = '50%';
				el.style.cursor = 'pointer';
				el.style.padding = '0';
				el.style.border = '0.1rem solid white';
				el.style.backgroundSize = 'cover';
				el.style.backgroundPosition = 'center';
				el.style.backgroundRepeat = 'no-repeat';

				if (!isCluser) {
					const [{ properties }] = value.features;
					const imageUrl = properties.thumbnailUrl ?? '/map-marker-question.png';
					el.style.width = '40px';
					el.style.height = '40px';
					el.style.backgroundImage = `url('${imageUrl}')`;
					el.style.backgroundColor = properties.thumbnailUrl ? 'transparent' : 'white';
				} else {
					const count = document.createElement('span');
					count.textContent = `${features.length}`;
					count.style.position = 'absolute';
					el.style.width = `${40 + features.length * 2}px`;
					el.style.height = `${40 + features.length * 2}px`;
					count.style.top = '50%';
					count.style.left = '50%';
					count.style.transform = 'translate(-50%, -50%)';
					count.style.color = 'white';
					count.style.fontWeight = 'bold';
					el.style.backgroundImage = `url('${encodeURI(value.clusterImageUri!)}')`;
					el.appendChild(count);
				}

				const marker = new mapboxgl.Marker(el).setLngLat(geometry.coordinates).addTo(map);

				el.addEventListener('click', (e) => {
					e.stopPropagation();
					setActiveCluster(value);
				});

				markersRef.current.push(marker);
			}
		},

		[map, setActiveCluster]
	);

	return { displayMarkers, markersRef };
};
