import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../schemas/user.schema.js";
import { UserController } from "../controller/user.controller.js";
import { UserService } from "../service/user-service.service.js";

@Module({
    imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService, MongooseModule]
})

export class UserModule {}