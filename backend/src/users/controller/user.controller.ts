import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { UserService } from "../service/user-service.service.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import type { AuthUser } from "../../common/interfaces/auth-user.interface.js";
import { Roles } from "../../common/decorators/rol.decorator.js";
import { Rol } from "../../common/enums/rol.enum.js";
import { CreateUserDTO } from "../dto/create-user.dto.js";
import { UpdateUserDTO } from "../dto/update-user.dto.js";
import { StateUserDTO } from "../dto/state-user.dto.js";

@Controller('users')
export class UserController {

    constructor(private readonly users: UserService) { }

    @Get('me')
    me(@CurrentUser() user: AuthUser) {
        return this.users.getById(user.idUser);
    }

    @Get('directory')
    directory() {
        return this.users.directory();
    }

    @Roles(Rol.ADMIN) @Post('create-user')
    create(@Body() createDto: CreateUserDTO) {
        return this.users.create(createDto);
    }

    @Roles(Rol.ADMIN) @Get('all-users')
    findAll() {
        return this.users.findAll();
    }

    @Roles(Rol.ADMIN) @Patch(':id/update')
    update(@Param('id') id: string, @Body() updateDto: UpdateUserDTO) {
        return this.users.update(id, updateDto);
    }

    @Roles(Rol.ADMIN) @Patch(':id/state')
    setActivo(@Param('id') id: string, @Body() stateDto: StateUserDTO, @CurrentUser() actor: AuthUser) {
        return this.users.setActivo(id, stateDto.state, actor.idUser);
    }
}