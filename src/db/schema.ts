import { z } from 'zod';
import he from 'he';

const dayEnums = z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
const partnerValues = z.enum(['presentedby', 'producedby', 'sponsoredby', 'none', 'supportedby', 'fundedby']);
const accessibilityValues = z.enum(['full', 'none']);
const featureKeys = z.enum(['Paid Parking', 'Onsite Food and Beverages', 'Public Washrooms', 'Bike Racks', 'Free Parking']);
const frequencyValues = z.enum(['once', 'weekly', 'dates']);
const datesValues = z.enum(['startDateTime', 'endDateTime']);
const locationMarkerValues = z.enum(['marker', 'polygon', 'polyline']);
const orgTypes = z.enum(['Non-Profit', 'Public Agency', 'Private/Business', 'Other']);

const weeklyDatesObj = z.object({
	weekDay: dayEnums,
	startTime: z.string().datetime().optional(),
	endTime: z.string().datetime().optional(),
});

const coordsObj = z.object({
	lng: z.number(),
	lat: z.number(),
});

const locationObj = z.object({
	locationName: z.string(),
	address: z.string(),
	type: locationMarkerValues,
	geoCoded: z.boolean(),
	displayAddress: z.string().optional(),
	coords: coordsObj,
});

const costObj = z.object({
	from: z.number().optional(),
	to: z.number().optional(),
	ga: z.number().optional(),
	child: z.number().nullish(),
	youth: z.number().optional(),
	student: z.number().optional(),
	adult: z.number().optional(),
	senior: z.number().optional(),
});

export const imageObj = z.object({
	fileName: z.string().optional(),
	altText: z.string().optional(),
	binId: z.string().optional(),
	fileSize: z.number().optional(),
	fileType: z.string().trim().optional(),
	credit: z.string().optional(),
	url: z
		.string()
		.trim()
		.transform((val) => {
			if (val === '') return undefined;
			return `https://secure.toronto.ca/${encodeURI(val)}`;
		})
		.pipe(z.string().url().optional())
		.optional(),
});

const reservationObject = z.object({
	website: z
		.string()
		.trim()
		.url()
		.or(z.literal(''))
		.optional()
		.transform((val) => (val === '' ? null : val)), //	URL	event website
	email: z
		.string()
		.trim()
		.email()
		.or(z.literal(''))
		.optional()
		.transform((val) => (val === '' ? null : val)), //	email	event email
	phone: z
		.string()
		.or(z.literal(''))
		.optional()
		.transform((val) => (val === '' ? null : val)), // event phone
	phoneExt: z
		.string()
		.or(z.literal(''))
		.transform((val) => (val === '' ? null : val))
		.optional(), // event phone extension
});

export const eventPayloadSchema = z.object({
	id: z.number(),
	eventName: z
		.string()
		.trim()
		.transform((val) => he.decode(val)),
	eventWebsite: z
		.string()
		.trim()
		.url()
		.or(z.literal(''))
		.optional()
		.transform((val) => (val === '' ? null : val)), //	URL	event website
	eventEmail: z
		.string()
		.trim()
		.email()
		.or(z.literal(''))
		.optional()
		.transform((val) => (val === '' ? null : val)), //	email	event email
	eventPhone: z
		.string()
		.or(z.literal(''))
		.optional()
		.transform((val) => (val === '' ? null : val)), // event phone
	eventPhoneExt: z
		.string()
		.or(z.literal(''))
		.transform((val) => (val === '' ? null : val))
		.optional(), // event phone extension
	partnerType: partnerValues, //	event partner type
	partnerName: z.string().optional(), //	event partner name
	expectedAvg: z.number().optional().nullable(), // expected average attendance
	categoryString: z.string().optional(), // String of all category names
	themeString: z.string().transform((val) => (val === '' ? null : val)), //	string of all themes
	accessibility: accessibilityValues.transform((val) => (val === 'full' ? true : false)), //	Event location/venue accessibility
	features: z
		.record(featureKeys, z.boolean())
		.transform((val) => {
			const features: string[] = [];
			for (const [key, value] of Object.entries(val)) {
				if (value) features.push(key);
			}
			return features;
		})
		.optional(), //array of Objects	event features
	frequency: frequencyValues.optional(), //	event frequency
	startDate: z.string().datetime(), //	overall start date
	endDate: z.string().datetime(), // overall end date
	dates: z.array(z.record(datesValues, z.string().datetime().nullable())), // Array of dates for the event
	weeklyDates: z.array(weeklyDatesObj).optional(), // array of Objects	Array of weekly date information
	timeInfo: z.string().optional(), //	additional time information
	locations: z.array(locationObj), // array of objects	event location(s)
	freeEvent: z.string().transform((val) => val === 'Yes'), //	Free Event Indiciator
	cost: costObj.optional(), //	object	Various costs
	otherCostInfo: z.string().optional(), //	Other Cost Information
	description: z.string().transform((val) => he.decode(val)),
	allDay: z.boolean().optional(),
	reservationsRequired: z.string().transform((val) => val === 'Yes'),
	image: imageObj.optional(),
	thumbImage: imageObj.optional(),
	orgName: z.string(), //	Organization Name
	contactName: z.string(), //	Contact Name
	contactTitle: z.string().optional(), //	Title
	orgAddress: z.string(), //	Address
	orgPhone: z.string(), //	Phone Number
	orgPhoneExt: z.string().optional(), //	Phone Ext.
	orgEmail: z.string().trim().email(), //	Email
	orgType: orgTypes.optional(), //	Organization Type
	orgTypeOther: z.string().optional(), //	Other
	reservation: reservationObject.optional(),
});

export const eventTableSchema = z
	.object({
		id: z.string(),
		eventName: z.string(),
		eventWebsite: z.string().nullable(),
		eventEmail: z.string().nullable(),
		eventPhone: z.string().nullable(),
		eventPhoneExt: z.string().nullable(),
		partnerType: z.string().nullable(),
		partnerName: z.string().nullable(),
		expectedAvg: z.number().nullable(),
		accessibility: z.string(),
		frequency: z.string(),
		startDate: z.string().datetime(),
		endDate: z.string().datetime(),
		timeInfo: z.string().nullable(),
		freeEvent: z.string(),
		orgName: z.string(),
		contactName: z.string(),
		contactTitle: z.string().nullable(),
		orgAddress: z.string(),
		orgPhone: z.string(),
		orgPhoneExt: z.string().nullable(),
		orgEmail: z.string(),
		orgType: z.string().nullable(),
		orgTypeOther: z.string().nullable(),
		categoryString: z.string(),
		description: z.string(),
		allDay: z.string().nullable(),
		reservationsRequired: z.string(),
		features: z.string().nullable(),
	})
	.describe('event');

export const dateTableSchema = z
	.object({
		id: z.number().optional(),
		eventId: z.number(),
		allDay: z.boolean().optional(),
		startDate: z.string().datetime(),
		endDate: z.string().datetime(),
	})
	.describe('event_date');

export const weeklyDateTableSchema = z
	.object({
		id: z.number().optional(),
		eventId: z.number(),
		day: z.string().optional(),
		startTime: z.string().datetime().optional(),
		endTime: z.string().datetime().optional(),
	})
	.describe('weeklyDate');

export const locationTableSchema = z
	.object({
		id: z.number().optional(),
		eventId: z.number(),
		lat: z.number(),
		lng: z.number(),
		locationName: z.string(),
		address: z.string().optional(),
		displayAddress: z.string().optional(),
		thumbnailUrl: z.string().optional(),
		imageUrl: z.string().optional(),
		imageAlText: z.string().optional(),
	})
	.describe('location');

export const costTableSchema = z
	.object({
		id: z.number().optional(),
		eventId: z.number(),
		child: z.number().optional(),
		youth: z.number().optional(),
		student: z.number().optional(),
		adult: z.number().optional(),
		senior: z.number().optional(),
		priceFrom: z.number().optional(),
		priceTo: z.number().optional(),
		generalAdmission: z.number().optional(),
	})
	.describe('cost');

export const reservationTableSchema = z
	.object({
		id: z.number().optional(),
		eventId: z.number(),
		website: z.string().optional(),
		phone: z.string().optional(),
		phoneExt: z.string().optional(),
		email: z.string().optional(),
	})
	.describe('reservation');

export const clusterTableSchema = z.object({
	id: z.string(),
	locationName: z.string(),
});
