import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FolderModule } from '../../folders/module/folder.module.js';
import { FileEntry, FileEntrySchema } from '../schemas/file.schema.js';
import { FileComment, FileCommentSchema } from '../schemas/comment.schema.js';
import { FileController } from '../controller/file.controller.js';
import { FileService } from '../service/file-service.service.js';
import { GridFsService } from '../service/gridfs-service.service.js';
import { CommentService } from '../service/comment.service.js';
import { SharingModule } from '../../sharing/module/sharing.module.js';
import { ActivityModule } from '../../activity/module/activity.module.js';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: FileEntry.name, schema: FileEntrySchema },
            { name: FileComment.name, schema: FileCommentSchema },
        ]),
        forwardRef(() => FolderModule),
        forwardRef(() => SharingModule),
        ActivityModule,
    ],
    controllers: [FileController],
    providers: [FileService, GridFsService, CommentService],
    exports: [FileService, GridFsService, MongooseModule]
})
export class FileModule {}
