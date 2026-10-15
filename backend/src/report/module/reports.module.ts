import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileEntry, FileEntrySchema } from '../../files/schemas/file.schema.js';
import { Share, ShareSchema } from '../../sharing/schemas/share.schema.js';
import { Activity, ActivitySchema } from '../../activity/schemas/activity.schema.js';
import { ReportsController } from '../controller/reports.controller.js';
import { ReportsService } from '../service/reports.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FileEntry.name, schema: FileEntrySchema },
      { name: Share.name, schema: ShareSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}