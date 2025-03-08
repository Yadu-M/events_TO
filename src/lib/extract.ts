import { z } from 'zod';
import { eventPayloadSchema } from '../db/schema';

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
		features: event.features,
	};
}

export function extractDate(event: z.infer<typeof eventPayloadSchema>, id: number) {
	return {
		eventId: id,
		allDay: event.allDay,
		startDate: event.startDate,
		endDate: event.endDate,
	};
}

export function extractWeeklyDate(event: z.infer<typeof eventPayloadSchema>, id: number) {
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

export function extractLocation(event: z.infer<typeof eventPayloadSchema>, id: number) {
	const [location] = event.locations.filter((location) => location.type === 'marker');
	if (!location) return {};

	const result = {
		eventId: id,
		lat: location.coords.lat,
		lng: location.coords.lng,
		locationName: location.locationName,
		displayAddress: location.displayAddress,
	};
	return result;
}

export function extractCost(event: z.infer<typeof eventPayloadSchema>, id: number) {
	const cost = event.cost;

	if (!cost) return {};

	return {
		eventId: id,
		child: cost?.child,
		youth: cost?.youth,
		student: cost?.student,
		adult: cost?.adult,
		senior: cost?.senior,
		_from: cost?.from,
		_to: cost?.to,
		generalAdmission: cost?.ga,
	};
}

export function extractReservation(event: z.infer<typeof eventPayloadSchema>, id: number) {
	return {
		eventId: id,
		website: event.eventWebsite,
		phone: event.eventPhone,
		phoneExt: event.eventPhoneExt,
		email: event.eventEmail,
	};
}
