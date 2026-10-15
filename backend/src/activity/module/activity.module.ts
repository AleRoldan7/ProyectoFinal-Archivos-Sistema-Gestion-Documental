import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Mongoose } from "mongoose";
import { Activity, ActivitySchema } from "../schemas/activity.schema.js";
import { ActivityController } from "../controller/activity.controller.js";
import { ActivityService } from "../service/activity.service.js";

@Global()
@Module({
    imports: [MongooseModule.forFeature([{ name: Activity.name, schema: ActivitySchema }])],
    controllers: [ActivityController],
    providers: [ActivityService],
    exports: [ActivityService, MongooseModule],
})
export class ActivityModule {}