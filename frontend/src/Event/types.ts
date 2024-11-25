export interface Event {
  id: number;
  event_name: string;
  description: string;
  category: string;
  org_name: string;
  org_type: string;
  partner_name: string;
  accessibility: string;
  other_cost_info: string;
  start_date: Date;
  end_date: Date;
  updated_at: Date;
}
