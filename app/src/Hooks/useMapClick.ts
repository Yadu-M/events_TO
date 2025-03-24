import { Map } from 'mapbox-gl';
import { useEffect } from 'react';

export const useMapClick = (map: Map | null, callback: (_: any) => void) => {
	useEffect(() => {
		if (!map) return;
		map.on('click', callback);
		return () => {
			map.off('click', callback);
		};
	}, [map]);
};
