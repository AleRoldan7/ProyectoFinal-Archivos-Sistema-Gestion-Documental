import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Folder, FolderSchema } from '../schemas/folder.schema.js';
import { FolderController } from '../controller/folder.controller.js';
import { FolderService } from '../service/folder-service.service.js';


@Module({
    imports: [MongooseModule.forFeature([{ name: Folder.name, schema: FolderSchema }])],
    controllers: [FolderController],
    providers: [FolderService],
    exports: [FolderService, MongooseModule]
})

export class FolderModule {}