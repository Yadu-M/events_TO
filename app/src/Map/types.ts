export type markerPropertiesT = {
  address: string;  
  accessibility: boolean;
  category: string;
  cost?: {
    _from: number | null;
    _to: number | null;
    adult: number | null;
    child: number | null;
    generalAdmission: number | null;
    senior: number | null;
    student: number | null;
    youth: number | null;
  };
  description: string;
  endDate: string;
  eventId: number;
  eventName: string;
  eventWebsite: string;
  features: string;
  freeEvent: string;
  locationName: string;
  startDate: string;
  reservationsRequired: string;
};
