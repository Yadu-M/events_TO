import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Options } from '../Header/Options';
import { useQuery } from '@tanstack/react-query';
import { fetchGeoJSON } from '@/api/api';
import { useMapbox } from '@/Hooks/useMapbox';
import { ClusterFeatureCollection } from '../types';
import { useMarkers } from '@/Hooks/useMarkers';
import { createPortal } from 'react-dom';
import { Popup } from './Popup';
import { ClusterPopup } from './ClusterPopup';

export const Map = () => {
	const [activeCluster, setActiveCluster] = useState<ClusterFeatureCollection | null>(null);
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const popupRef = useRef<mapboxgl.Popup | null>(null);
	const popupContainerRef = useRef<HTMLDivElement>(document.createElement('div'));
	const { map, mapLoaded } = useMapbox(mapContainerRef);

	const {
		data: geojsonData,
		isPending,
		error,
	} = useQuery({
		queryKey: ['geojson'],
		queryFn: fetchGeoJSON,
		enabled: mapLoaded,
	});

	const { displayMarkers } = useMarkers(map, setActiveCluster);

	// Initialize the Mapbox popup once
	useEffect(() => {
		if (mapLoaded && map && !popupRef.current) {
			popupRef.current = new mapboxgl.Popup({
				maxWidth: '75vw',
				closeButton: false,
			});
		}
	}, [mapLoaded, map]);

	// Update popup content when activeCluster changes
	useEffect(() => {
		if (!map || !popupRef.current) return;

		if (activeCluster && activeCluster.features.length === 1) {
			popupRef.current.setDOMContent(popupContainerRef.current).setLngLat(activeCluster.features[0].geometry.coordinates).addTo(map);
		} else {
			popupRef.current.remove();
		}
	}, [map, activeCluster]);

	// Load markers when geojsonData is ready
	useEffect(() => {
		if (mapLoaded && map && geojsonData && !isPending) {
			displayMarkers(geojsonData);
		}
	}, [mapLoaded, map, geojsonData, isPending, displayMarkers]);

	// Handle map click to close popup
	useEffect(() => {
		if (!map) return;
		const handleMapClick = () => setActiveCluster(null);
		map.on('click', handleMapClick);
		
		return () => {
			map.off('click', handleMapClick);
		};
	}, [map]);

	return (
		<>
			<div id="map" ref={mapContainerRef} className="absolute inset-0" />
			{(!mapLoaded || isPending) && (
				<div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
					<div>Loading...</div>
				</div>
			)}
			{error && (
				<div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-50">
					<div>An error has occurred: {error.message}</div>
				</div>
			)}
			<header className="absolute top-0 left-0 z-10 pointer-events-none">
				<h1>TO Events</h1>
			</header>
			{geojsonData && map && <Options mapRef={{ current: map }} />}
			{activeCluster &&
				(activeCluster.features.length > 1 ? (
					<ClusterPopup cluster={activeCluster} />
				) : (
					createPortal(<Popup feature={activeCluster.features[0]} />, popupContainerRef.current)
				))}
		</>
	);
};
