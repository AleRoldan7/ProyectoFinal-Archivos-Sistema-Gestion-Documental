import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FolderModule } from '../../folders/module/folder.module.js';
import { FileModule } from '../../files/module/file.module.js';
import { UserModule } from '../../users/module/user.module.js';
import { Share, ShareSchema } from '../schemas/share.schema.js';
import { SharingController } from '../controller/sharing.controller.js';
import { SharingService } from '../service/sharing.service.js';
import { AccessService } from '../service/access.service.js';

@Module({
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
export class SharingModule {}