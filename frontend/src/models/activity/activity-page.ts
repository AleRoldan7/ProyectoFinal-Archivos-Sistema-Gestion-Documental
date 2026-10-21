import { ActivityResponse } from "./activity-response";

export interface ActivityPage {
  items: ActivityResponse[];
  total: number;
  page: number;
  limit: number;
}