import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthUser } from '../../common/interfaces/auth-user.interface.js';
import { ParseObjectIdPipe } from '../../common/pipes/parse-object-id.pipe.js';
import { SharingService } from '../service/sharing.service.js';
import { CreateShareDTO, UpdateShareDTO } from '../dto/share.dto.js';

@Controller('shares')
export class SharingController {
  constructor(private readonly sharing: SharingService) {}

  @Post()
  compartir(@CurrentUser() user: AuthUser, @Body() dto: CreateShareDTO) {
    return this.sharing.share(user.idUser, dto);
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
  cambiar(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string, @Body() dto: UpdateShareDTO) {
    return this.sharing.changePermission(user.idUser, id, dto);
  }

  @Delete(':id')
  revocar(@CurrentUser() user: AuthUser, @Param('id', ParseObjectIdPipe) id: string) {
    return this.sharing.revoke(user.idUser, id);
  }
}