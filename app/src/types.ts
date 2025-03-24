import { FeatureCollection } from 'geojson';

export interface ClusterGeometry {
	coordinates: [number, number];
	type: 'Point';
}

export interface ClusterFeatureCollection extends FeatureCollection<ClusterGeometry, Location> {
	clusterImageUri?: string;
}

export type GeoJsonPayload = Record<string, ClusterFeatureCollection>;

export type EventFeature = 'Public Washrooms' | 'Free Parking' | 'Paid Parking' | 'Bike Racks' | 'Onsite Food and Beverages';

export interface Event {
	id: string;
	eventName: string;
	eventWebsite?: string;
	eventEmail?: string;
	eventPhone?: string;
	eventPhoneExt?: string;
	partnerType?: string;
	partnerName?: string;
	expectedAvg?: number;
	accessibility: string;
	frequency: string;
	startDate: string;
	endDate: string;
	timeInfo?: string;
	freeEvent: string;
	orgName: string;
	contactName: string;
	contactTitle?: string;
	orgAddress: string;
	orgPhone: string;
	orgPhoneExt?: string;
	orgEmail: string;
	orgType?: string;
	orgTypeOther?: string;
	categoryString: string;
	description: string;
	allDay?: string;
	reservationsRequired: string;
	features?: string;
}

export interface Location {
	id: number;
	eventId: number;
	lat: number;
	lng: number;
	locationName: string;
	address?: string;
	displayAddress?: string;
	thumbnailUrl?: string;
	imageUrl?: string;
	imageAlText?: string;
}

export interface Date {
	eventId: number;
	startDate: string;
	endDate: string;
	id?: number | undefined;
	allDay?: boolean | undefined;
}

export interface Cost {
	eventId: number;
	id?: number | undefined;
	child?: number | undefined;
	youth?: number | undefined;
	student?: number | undefined;
	adult?: number | undefined;
	senior?: number | undefined;
	priceFrom?: number | undefined;
	priceTo?: number | undefined;
	generalAdmission?: number | undefined;
}

export interface EventInfo {
	event: Event;
	date: Date;
	cost?: Cost;
}
