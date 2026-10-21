var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileEntry, FileEntrySchema } from '../../files/schemas/file.schema.js';
import { Share, ShareSchema } from '../../sharing/schemas/share.schema.js';
import { Activity, ActivitySchema } from '../../activity/schemas/activity.schema.js';
import { ReportsController } from '../controller/reports.controller.js';
import { ReportsService } from '../service/reports.service.js';
import { Folder, FolderSchema } from '../../folders/schemas/folder.schema.js';
let ReportsModule = class ReportsModule {
};
ReportsModule = __decorate([
    Module({
        imports: [
            MongooseModule.forFeature([
                { name: FileEntry.name, schema: FileEntrySchema },
                { name: Folder.name, schema: FolderSchema },
                { name: Share.name, schema: ShareSchema },
                { name: Activity.name, schema: ActivitySchema },
            ]),
        ],
        controllers: [ReportsController],
        providers: [ReportsService],
    })
], ReportsModule);
export { ReportsModule };
//# sourceMappingURL=reports.module.js.map