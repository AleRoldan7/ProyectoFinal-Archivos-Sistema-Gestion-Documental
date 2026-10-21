import { Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { TrashService } from "../service/trash.service.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import type { AuthUser } from "../../common/interfaces/auth-user.interface.js";
import { ParseObjectIdPipe } from "@nestjs/mongoose";

@Controller()
export class TrashController {

    constructor(private readonly trashService: TrashService) {}

    @Delete('folders/:id')
    sendFolder(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string) {
        return this.trashService.sendFolder(user.idUser, id);
    }

    @Delete('files/:id')
    sendFile(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string) {
        return this.trashService.sendFile(user.idUser, id);
    }

    @Get('trash')
    listar(@CurrentUser() user: AuthUser) {
        return this.trashService.list(user.idUser);
    }

    @Patch('trash/folders/:id/restore')
    restaurarCarpeta(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string) {
        return this.trashService.restoredFolder(user.idUser, id);
    }

    @Patch('trash/files/:id/restore')
    restaurarArchivo(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string) {
        return this.trashService.restoredFile(user.idUser, id);
    }

    @Delete('trash/folders/:id')
    eliminarCarpeta(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string) {
        return this.trashService.deleteFolder(user.idUser, id);
    }

    @Delete('trash/files/:id')
    eliminarArchivo(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string) {
        return this.trashService.deleteFile(user.idUser, id);
    }
}