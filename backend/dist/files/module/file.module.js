var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FolderModule } from '../../folders/module/folder.module.js';
import { FileEntry, FileEntrySchema } from '../schemas/file.schema.js';
import { FileController } from '../controller/file.controller.js';
import { FileService } from '../service/file-service.service.js';
import { GridFsService } from '../service/gridfs-service.service.js';
let FileModule = class FileModule {
};
FileModule = __decorate([
    Module({
        imports: [
            MongooseModule.forFeature([{ name: FileEntry.name, schema: FileEntrySchema }]),
            FolderModule
        ],
        controllers: [FileController],
        providers: [FileService, GridFsService],
        exports: [FileService, GridFsService, MongooseModule]
    })
], FileModule);
export { FileModule };
//# sourceMappingURL=file.module.js.map