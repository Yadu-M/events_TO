export type hoverT = {
  hoveredMarker: HTMLDivElement;
  eventId: number;
};

export interface EventI {
  id: number;
  eventName: string;
  eventWebsite: string;
  eventEmail: string;
  eventPhone: string;
  eventPhoneExt: string;
  partnerType: string;
  partnerName: string;
  expectedAvg?: number;
  accessibility: string;
  frequency: string;
  startDate: string;
  endDate: string;
  timeInfo: string;
  freeEvent: string;
  orgName: string;
  contactName: string;
  contactTitle: string;
  orgAddress: string;
  orgPhone: string;
  orgPhoneExt: string;
  orgFax: string;
  orgEmail: string;
  orgType: string;
  orgTypeOther: string;
  categoryString: string;
  description: string;
  allDay: string;
}
