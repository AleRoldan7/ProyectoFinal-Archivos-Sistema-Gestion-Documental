import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Rol } from "../../common/enums/rol.enum.js";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: 'users' })
export class User {

    @Prop({required: true, trim: true})
    firstName: string;

    @Prop({required: true, trim: true})
    lastName: string;

    @Prop({required: true, unique: true, lowercase: true, trim: true})
    email: string;

    @Prop({required: true, select: false})
    password: string;

    @Prop({required: true, enum: Rol, default: Rol.USUARIO})
    rol: Rol;

    @Prop({default: true})
    stateUser: boolean;

}

export const UserSchema = SchemaFactory.createForClass(User);