import { ActionActivity } from "./activity-response";

export interface ActivityQuery {
  userId?: string;
  action?: ActionActivity | '';
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}
