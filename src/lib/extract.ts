import { z } from 'zod';
import {
	costTableSchema,
	dateTableSchema,
	eventPayloadSchema,
	locationTableSchema,
	reservationTableSchema,
	weeklyDateTableSchema,
} from '../db/schema';

export function extractEvent(event: z.infer<typeof eventPayloadSchema>) {
	return {
		id: event.id,
		eventName: event.eventName,
		eventWebsite: event.eventWebsite,
		eventEmail: event.eventEmail,
		eventPhone: event.orgPhone,
		eventPhoneExt: event.eventPhoneExt,
		partnerType: event.partnerType,
		partnerName: event.partnerName,
		expectedAvg: event.expectedAvg,
		accessibility: event.accessibility,
		frequency: event.frequency,
		startDate: event.startDate,
		endDate: event.endDate,
		timeInfo: event.timeInfo,
		freeEvent: event.freeEvent,
		orgName: event.orgName,
		contactName: event.contactName,
		contactTitle: event.contactTitle,
		orgAddress: event.orgAddress,
		orgPhone: event.orgPhone,
		orgPhoneExt: event.orgPhoneExt,
		orgEmail: event.orgEmail,
		orgType: event.orgType,
		orgTypeOther: event.orgTypeOther,
		categoryString: event.categoryString,
		description: event.description,
		allDay: event.allDay,
		reservationsRequired: event.reservationsRequired,
		features: event.features?.toString(),
	};
}

export function extractDate(event: z.infer<typeof eventPayloadSchema>, id: number): z.infer<typeof dateTableSchema> {
	return {
		allDay: event.allDay,
		endDate: event.endDate,
		eventId: id,
		startDate: event.startDate,
	};
}

export function extractWeeklyDate(event: z.infer<typeof eventPayloadSchema>, id: number): z.infer<typeof weeklyDateTableSchema> | {} {
	const weeklyDates = event.weeklyDates;

	if (!weeklyDates || weeklyDates.length === 0) {
		return {};
	}

	const day = weeklyDates.map((date) => date.weekDay).join(',');
	const startTime = weeklyDates.map((date) => date.startTime).join(',');
	const endTime = weeklyDates.map((date) => date.endTime).join(',');

	if (!day && !startTime && !endTime) {
		return {};
	}

	return {
		eventId: id,
		day,
		startTime,
		endTime,
	};
}

export function extractLocation(event: z.infer<typeof eventPayloadSchema>, id: number): z.infer<typeof locationTableSchema> | {} {
	type locationT = z.infer<typeof locationTableSchema>;
	const [location] = event.locations.filter((location) => location.type === 'marker');
	if (!location) return {};

	const result: locationT = {
		eventId: id,
		lat: location.coords.lat,
		lng: location.coords.lng,
		locationName: location.locationName,
		displayAddress: location.displayAddress,
		address: location.address,
		imageAlText: event.image?.altText,
		imageUrl: event.image?.url,
		thumbnailUrl: event.thumbImage?.url,
	};

	return result;
}

export function extractCost(event: z.infer<typeof eventPayloadSchema>, id: number): z.infer<typeof costTableSchema> | {} {
	const cost = event.cost;

	if (!cost) return {};

	return {
		eventId: id,
		child: cost?.child,
		youth: cost?.youth,
		student: cost?.student,
		adult: cost?.adult,
		senior: cost?.senior,
		priceFrom: cost?.from,
		priceTo: cost?.to,
		generalAdmission: cost?.ga,
	};
}

export function extractReservation(event: z.infer<typeof eventPayloadSchema>, id: number): z.infer<typeof reservationTableSchema> | {} {
	if (!event.reservation) return {};
	const reservation = event.reservation;

	return {
		email: reservation.email,
		phone: reservation.phone,
		phoneExt: reservation.phoneExt,
		website: reservation.website,
		eventId: id,
	};
}