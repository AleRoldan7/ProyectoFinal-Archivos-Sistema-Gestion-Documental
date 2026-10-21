import { ActionActivity } from '../../common/enums/action-activity.enum.js';
export declare class ListActivityDTO {
    userId?: string;
    action?: ActionActivity;
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
}
