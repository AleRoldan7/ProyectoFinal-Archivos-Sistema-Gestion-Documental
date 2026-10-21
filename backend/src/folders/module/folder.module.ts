import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Folder, FolderSchema } from '../schemas/folder.schema.js';
import { FolderController } from '../controller/folder.controller.js';
import { FolderService } from '../service/folder-service.service.js';
import { SharingModule } from '../../sharing/module/sharing.module.js';
import { FileModule } from '../../files/module/file.module.js';


@Module({
    imports: [MongooseModule.forFeature([{ name: Folder.name, schema: FolderSchema }]),
    forwardRef(() => FileModule),      
    forwardRef(() => SharingModule),   
    ],
    controllers: [FolderController],
    providers: [FolderService],
    exports: [FolderService, MongooseModule]
})

export class FolderModule { }