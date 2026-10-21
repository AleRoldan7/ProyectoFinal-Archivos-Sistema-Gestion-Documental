import { Model } from 'mongoose';
export declare function adjuntarNombres<T extends {
    resourceType: string;
    resourceId: any;
    toObject(): any;
}>(shares: T[], files: Model<any>, folders: Model<any>): Promise<any[]>;
