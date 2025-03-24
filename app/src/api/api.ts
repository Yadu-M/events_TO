import { EventInfo, GeoJsonPayload } from '@/types';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// Backend Calls

export const fetchGeoJSON = async (): Promise<GeoJsonPayload> => {
	const response = await fetch('https://api.eventto.ca/geojson');

	return await response.json();
};

export const fetchEventInfo = async (eventId: number): Promise<EventInfo> => {
	const response = await fetch(`https://api.eventto.ca/eventInfo?id=${eventId}`);

	return await response.json();
};
