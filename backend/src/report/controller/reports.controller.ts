import { ForbiddenException, Controller, Get, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthUser } from '../../common/interfaces/auth-user.interface.js';
import { Roles } from '../../common/decorators/rol.decorator.js';
import { Rol } from '../../common/enums/rol.enum.js';
import { ReportsService } from '../service/reports.service.js';
import { FiltroReporteDTO } from '../dto/filter-report.dto.js';

@Roles(Rol.ADMIN) 
@Controller('reports')
export class ReportsController {
  
    constructor(private readonly reports: ReportsService) {}

  private usuarioPermitido(user: AuthUser, userId?: string): string {
    if (user.rol === Rol.ADMIN) return userId ?? user.idUser;
    if (userId && userId !== user.idUser) throw new ForbiddenException('Solo puedes consultar tus propios datos');
    return user.idUser;
  }

  @Get('files/by-type')
  archivosPorTipo() { return this.reports.archivosPorTipo(); }

  @Get('files/by-date')
  archivosEnRango(@Query() f: FiltroReporteDTO) { return this.reports.archivosEnRango(f.from, f.to); }

  @Get('files/most-operated')
  archivosMasOperados(@Query() f: FiltroReporteDTO) { return this.reports.archivosMasOperados(f.limit); }

  @Get('users/top-files')
  topUsuarios(@Query() f: FiltroReporteDTO) { return this.reports.topUsuariosConArchivos(f.limit); }

  @Get('users/most-shared')
  usuariosCompartidos(@Query() f: FiltroReporteDTO) {
    return this.reports.usuariosConMasRecursosCompartidos(f.limit);
  }

  @Get('shares/most-shared-files')
  archivosCompartidos(@Query() f: FiltroReporteDTO) {
    return this.reports.archivosCompartidosConMasUsuarios(f.limit);
  }

  @Roles(Rol.ADMIN, Rol.USUARIO)
  @Get('shares/by-user')
  compartidosPor(@CurrentUser() user: AuthUser, @Query() f: FiltroReporteDTO) {
    return this.reports.compartidosPorUsuario(this.usuarioPermitido(user, f.userId));
  }

  @Roles(Rol.ADMIN, Rol.USUARIO)
  @Get('shares/received')
  recibidosPor(@CurrentUser() user: AuthUser, @Query() f: FiltroReporteDTO) {
    return this.reports.recibidosPorUsuario(this.usuarioPermitido(user, f.userId));
  }

  @Roles(Rol.ADMIN, Rol.USUARIO)
  @Get('activity/user')
  actividadUsuario(@CurrentUser() user: AuthUser, @Query() f: FiltroReporteDTO) {
    return this.reports.actividadDeUsuario(this.usuarioPermitido(user, f.userId), f.from, f.to);
  }

  @Get('activity/by-type')
  operacionesPorTipo(@Query() f: FiltroReporteDTO) { return this.reports.operacionesPorTipo(f.from, f.to); }

  @Get('activity/by-period')
  operacionesPorPeriodo(@Query() f: FiltroReporteDTO) {
    return this.reports.operacionesPorPeriodo(f.periodo, f.from, f.to);
  }

  @Get('activity/top-actions')
  principalesAcciones(@Query() f: FiltroReporteDTO) { return this.reports.principalesAcciones(f.limit); }
}