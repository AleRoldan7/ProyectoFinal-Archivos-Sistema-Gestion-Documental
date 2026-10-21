var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FolderModule } from '../../folders/module/folder.module.js';
import { FileModule } from '../../files/module/file.module.js';
import { UserModule } from '../../users/module/user.module.js';
import { Share, ShareSchema } from '../schemas/share.schema.js';
import { SharingController } from '../controller/sharing.controller.js';
import { SharingService } from '../service/sharing.service.js';
import { AccessService } from '../service/access.service.js';
let SharingModule = class SharingModule {
};
SharingModule = __decorate([
    Module({
        imports: [
            MongooseModule.forFeature([{ name: Share.name, schema: ShareSchema }]),
            forwardRef(() => FolderModule),
            forwardRef(() => FileModule),
            UserModule,
        ],
        controllers: [SharingController],
        providers: [SharingService, AccessService],
        exports: [AccessService],
    })
], SharingModule);
export { SharingModule };
//# sourceMappingURL=sharing.module.js.map