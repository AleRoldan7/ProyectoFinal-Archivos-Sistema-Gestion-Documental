import { Model } from 'mongoose';
import { FileCommentDocument } from '../schemas/comment.schema.js';
import { FileEntryDocument } from '../schemas/file.schema.js';
import { AccessService } from '../../sharing/service/access.service.js';
import { ActivityService } from '../../activity/service/activity.service.js';
export declare class CommentService {
    private readonly commentModel;
    private readonly fileModel;
    private readonly access;
    private readonly activity;
    constructor(commentModel: Model<FileCommentDocument>, fileModel: Model<FileEntryDocument>, access: AccessService, activity: ActivityService);
    private getFile;
    private toView;
    list(userId: string, fileId: string): Promise<{
        _id: string;
        text: string;
        createdAt: Date | undefined;
        author: {
            _id: string;
            firstName: string;
            lastName: string;
        };
        puedeEliminar: boolean;
    }[]>;
    create(userId: string, fileId: string, text: string): Promise<{
        _id: string;
        text: string;
        createdAt: Date | undefined;
        author: {
            _id: string;
            firstName: string;
            lastName: string;
        };
        puedeEliminar: boolean;
    }>;
    remove(userId: string, fileId: string, commentId: string): Promise<void>;
}
