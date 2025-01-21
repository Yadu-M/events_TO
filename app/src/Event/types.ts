export interface eventT {
  id: number;
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
  orgFax?: string;
  orgEmail: string;
  orgType?: string;
  orgTypeOther?: string;
  categoryString: string;
  description: string;
  allDay?: string;
  reservationsRequired: string;
  features?: string;
}

export interface dateT {
  id: number;
  eventId: number;
  allDay: string;
  startDateTime: string;
  endDateTime: string;
}

export interface weeklyDateT {
  id: number;
  eventId: number;
  day: string;
  startTime: string;
  endTime: string;
  description: string;
}

export interface locationT {
  id: number;
  eventId: number;
  lat: number;
  lng: number;
  locationName: string;
  address?: string;
  displayAddress?: string;
}

export interface costT {
  id: number;
  eventId?: number;
  child?: number;
  youth?: number;
  student?: number;
  adult?: number;
  senior?: number;
  _from?: number;
  _to?: number;
  generalAdmission?: number;
}

export interface image {
  id: number;
  eventId: number;
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  altText: string;
  credit?: string;
  url: string;
}

export interface reservationT {
  id: number;
  eventId: number;
  website?: string;
  phone?: string;
  phoneExt?: string;
  email?: string;
}

export interface TableToTypeMap {
  event: eventT;
  date: dateT;
  weeklyDate: weeklyDateT;
  location: locationT;
  cost: costT;
  image: image;
  reservation: reservationT;
}
