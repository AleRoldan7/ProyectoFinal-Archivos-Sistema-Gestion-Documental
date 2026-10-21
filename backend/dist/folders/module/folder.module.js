var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Folder, FolderSchema } from '../schemas/folder.schema.js';
import { FolderController } from '../controller/folder.controller.js';
import { FolderService } from '../service/folder-service.service.js';
import { SharingModule } from '../../sharing/module/sharing.module.js';
import { FileModule } from '../../files/module/file.module.js';
let FolderModule = class FolderModule {
};
FolderModule = __decorate([
    Module({
        imports: [MongooseModule.forFeature([{ name: Folder.name, schema: FolderSchema }]),
            forwardRef(() => FileModule),
            forwardRef(() => SharingModule),
        ],
        controllers: [FolderController],
        providers: [FolderService],
        exports: [FolderService, MongooseModule]
    })
], FolderModule);
export { FolderModule };
//# sourceMappingURL=folder.module.js.map