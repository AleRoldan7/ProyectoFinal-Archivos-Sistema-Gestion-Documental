var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../schemas/user.schema.js";
import { Model } from "mongoose";
import { ConfigService } from "@nestjs/config";
import { Rol } from "../../common/enums/rol.enum.js";
import * as bcrypt from 'bcrypt';
let UserService = class UserService {
    userModel;
    config;
    constructor(userModel, config) {
        this.userModel = userModel;
        this.config = config;
    }
    async onModuleInit() {
        if ((await this.userModel.countDocuments()) > 0)
            return;
        await this.create({
            firstName: this.config.getOrThrow('ADMIN_FIRST_NAME'),
            lastName: this.config.getOrThrow('ADMIN_LAST_NAME'),
            email: this.config.getOrThrow('ADMIN_EMAIL'),
            password: this.config.getOrThrow('ADMIN_PASSWORD'),
            rol: Rol.ADMIN
        });
    }
    async create(userDto) {
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
        }
        catch (e) {
            if (e?.code === 11000)
                throw new ConflictException('El correo ya fue registrado');
            throw e;
        }
    }
    findAll() {
        return this.userModel.find().sort({ firstName: 1 });
    }
    directory() {
        return this.userModel.find({ stateUser: true }).select('firstName email').sort({ firstName: 1 });
    }
    findById(id) {
        return this.userModel.findById(id);
    }
    async getById(id) {
        const user = await this.findById(id);
        if (!user)
            throw new NotFoundException('Usuario no encontrado');
        return user;
    }
    findByEmailWithPassword(email) {
        return this.userModel.findOne({ email: email.toLowerCase().trim() }).select('+password');
    }
    async update(id, updateDto) {
        const cambios = { ...updateDto };
        if (updateDto.password)
            cambios['password'] = await bcrypt.hash(updateDto.password, 10);
        else
            delete cambios['password'];
        try {
            const user = await this.userModel.findByIdAndUpdate(id, cambios, { new: true });
            if (!user)
                throw new NotFoundException('Usuario no encontrado');
            return user;
        }
        catch (e) {
            if (e?.code === 11000)
                throw new ConflictException('El correo ya fue registrado');
            throw e;
        }
    }
    async setActivo(id, state, actorId) {
        if (id === actorId && !state) {
            throw new ForbiddenException('No puedes desactivar tu propia cuenta');
        }
        const user = await this.userModel.findByIdAndUpdate(id, { stateUser: state }, { new: true });
        if (!user)
            throw new NotFoundException('Usuario no encontrado');
        return user;
    }
};
UserService = __decorate([
    Injectable(),
    __param(0, InjectModel(User.name)),
    __metadata("design:paramtypes", [Model, ConfigService])
], UserService);
export { UserService };
//# sourceMappingURL=user-service.service.js.map