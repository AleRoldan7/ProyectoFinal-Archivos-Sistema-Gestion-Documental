import { ConflictException, ForbiddenException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../schemas/user.schema.js";
import { Model } from "mongoose";
import { ConfigService } from "@nestjs/config";
import { Rol } from "../../common/enums/rol.enum.js";
import { CreateUserDTO } from "../dto/create-user.dto.js";
import { UpdateUserDTO } from "../dto/update-user.dto.js";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements OnModuleInit {

    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>, private readonly config: ConfigService) { }

    async onModuleInit() {

        if ((await this.userModel.countDocuments()) > 0) return;

        await this.create({
            firstName: this.config.getOrThrow<string>('ADMIN_FIRST_NAME'),
            lastName: this.config.getOrThrow<string>('ADMIN_LAST_NAME'),
            email: this.config.getOrThrow<string>('ADMIN_EMAIL'),
            password: this.config.getOrThrow<string>('ADMIN_PASSWORD'),
            rol: Rol.ADMIN
        });
    }

    async create(userDto: CreateUserDTO) {

        const password = await bcrypt.hash(userDto.password, 10);

        try {

            const user = await this.userModel.create({
                firstName: userDto.firstName,
                lastName: userDto.lastName,
                email: userDto.email,
                password,
                rol: userDto.rol ?? Rol.USUARIO

            });
            return this.getById(user.id);

        } catch (e: any) {

            if (e?.code === 11000) throw new ConflictException('El correo ya fue registrado');
            throw e;
        }
    }

    findAll() {
        return this.userModel.find().sort({ firstName: 1 });
    }

    directory() {
        return this.userModel.find({ stateUser: true }).select('firstName email').sort({ firstName: 1 });
    }

    findById(id: string) {
        return this.userModel.findById(id);
    }

    async getById(id: string) {
        const user = await this.findById(id);
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return user;
    }

    findByEmailWithPassword(email: string) {
        return this.userModel.findOne({ email: email.toLowerCase().trim() }).select('+password');
    }

    async update(id: string, updateDto: UpdateUserDTO) {
        const cambios: Record<string, unknown> = { ...updateDto };

        if (updateDto.password) cambios['password'] = await bcrypt.hash(updateDto.password, 10);
        else delete cambios['password'];

        try {
            const user = await this.userModel.findByIdAndUpdate(id, cambios, { new: true });
            if (!user) throw new NotFoundException('Usuario no encontrado');
            return user;
        } catch (e: any) {
            if (e?.code === 11000) throw new ConflictException('El correo ya fue registrado');
            throw e;
        }
    }

    async setActivo(id: string, state: boolean, actorId: string) {
        if (id === actorId && !state) {
            throw new ForbiddenException('No puedes desactivar tu propia cuenta');
        }
        const user = await this.userModel.findByIdAndUpdate(id, { stateUser: state }, { new: true });
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return user;
    }


}