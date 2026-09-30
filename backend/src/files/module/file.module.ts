import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FolderModule } from '../../folders/module/folder.module.js';
import { FileEntry, FileEntrySchema } from '../schemas/file.schema.js';
import { FileController } from '../controller/file.controller.js';
import { FileService } from '../service/file-service.service.js';
import { GridFsService } from '../service/gridfs-service.service.js';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: FileEntry.name, schema: FileEntrySchema }]),
        FolderModule
    ],
    controllers: [FileController],
    providers: [FileService, GridFsService],
    exports: [FileService, GridFsService, MongooseModule]
})
export class FileModule {}