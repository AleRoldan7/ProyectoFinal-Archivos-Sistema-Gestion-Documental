import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthUser } from '../../common/interfaces/auth-user.interface.js';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe.js';
import { SharingService } from '../service/sharing.service.js';
import { CreateShareDTO, UpdateShareDTO } from '../dto/share.dto.js';
import { ActivityService } from '../../activity/service/activity.service.js';
import { ActionActivity } from '../../common/enums/action-activity.enum.js';

@Controller('shares')
export class SharingController {

  constructor(private readonly sharing: SharingService, private readonly activity: ActivityService) { }

  @Post()
  async compartir(@CurrentUser() user: AuthUser, @Body() dto: CreateShareDTO) {
    const compartido = await this.sharing.share(user.idUser, dto);
    await this.activity.register(user.idUser, ActionActivity.SHARE, 'SHARE', compartido.id, dto.permission);
    return compartido;
  }

  @Get('with-me')
  conmigo(@CurrentUser() user: AuthUser) {
    return this.sharing.sharedWithMe(user.idUser);
  }

  @Get('by-me')
  porMi(@CurrentUser() user: AuthUser) {
    return this.sharing.sharedByMe(user.idUser);
  }

  @Patch(':id')
  async cambiar(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string, @Body() dto: UpdateShareDTO) {
    const actualizado = await this.sharing.changePermission(user.idUser, id, dto);
    await this.activity.register(user.idUser, ActionActivity.CHANGE_PERMISSION, 'SHARE', id, dto.permission);
    return actualizado;
  }

  @Delete(':id')
  async revocar(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string) {
    const eliminado = await this.sharing.revoke(user.idUser, id);
    await this.activity.register(user.idUser, ActionActivity.REVOKE_PERMISSION, 'SHARE', id);
    return eliminado;
  }
}