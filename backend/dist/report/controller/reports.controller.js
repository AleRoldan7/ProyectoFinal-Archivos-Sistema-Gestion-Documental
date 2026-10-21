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
import { ForbiddenException, Controller, Get, Query } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/rol.decorator.js';
import { Rol } from '../../common/enums/rol.enum.js';
import { ReportsService } from '../service/reports.service.js';
import { FiltroReporteDTO } from '../dto/filter-report.dto.js';
let ReportsController = class ReportsController {
    reports;
    constructor(reports) {
        this.reports = reports;
    }
    usuarioPermitido(user, userId) {
        if (user.rol === Rol.ADMIN)
            return userId ?? user.idUser;
        if (userId && userId !== user.idUser)
            throw new ForbiddenException('Solo puedes consultar tus propios datos');
        return user.idUser;
    }
    archivosPorTipo() { return this.reports.archivosPorTipo(); }
    archivosEnRango(f) { return this.reports.archivosEnRango(f.from, f.to); }
    archivosMasOperados(f) { return this.reports.archivosMasOperados(f.limit); }
    topUsuarios(f) { return this.reports.topUsuariosConArchivos(f.limit); }
    usuariosCompartidos(f) {
        return this.reports.usuariosConMasRecursosCompartidos(f.limit);
    }
    archivosCompartidos(f) {
        return this.reports.archivosCompartidosConMasUsuarios(f.limit);
    }
    compartidosPor(user, f) {
        return this.reports.compartidosPorUsuario(this.usuarioPermitido(user, f.userId));
    }
    recibidosPor(user, f) {
        return this.reports.recibidosPorUsuario(this.usuarioPermitido(user, f.userId));
    }
    actividadUsuario(user, f) {
        return this.reports.actividadDeUsuario(this.usuarioPermitido(user, f.userId), f.from, f.to);
    }
    operacionesPorTipo(f) { return this.reports.operacionesPorTipo(f.from, f.to); }
    operacionesPorPeriodo(f) {
        return this.reports.operacionesPorPeriodo(f.periodo, f.from, f.to);
    }
    principalesAcciones(f) { return this.reports.principalesAcciones(f.limit); }
};
__decorate([
    Get('files/by-type'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "archivosPorTipo", null);
__decorate([
    Get('files/by-date'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FiltroReporteDTO]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "archivosEnRango", null);
__decorate([
    Get('files/most-operated'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FiltroReporteDTO]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "archivosMasOperados", null);
__decorate([
    Get('users/top-files'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FiltroReporteDTO]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "topUsuarios", null);
__decorate([
    Get('users/most-shared'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FiltroReporteDTO]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "usuariosCompartidos", null);
__decorate([
    Get('shares/most-shared-files'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FiltroReporteDTO]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "archivosCompartidos", null);
__decorate([
    Roles(Rol.ADMIN, Rol.USUARIO),
    Get('shares/by-user'),
    __param(0, CurrentUser()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, FiltroReporteDTO]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "compartidosPor", null);
__decorate([
    Roles(Rol.ADMIN, Rol.USUARIO),
    Get('shares/received'),
    __param(0, CurrentUser()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, FiltroReporteDTO]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "recibidosPor", null);
__decorate([
    Roles(Rol.ADMIN, Rol.USUARIO),
    Get('activity/user'),
    __param(0, CurrentUser()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, FiltroReporteDTO]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "actividadUsuario", null);
__decorate([
    Get('activity/by-type'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FiltroReporteDTO]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "operacionesPorTipo", null);
__decorate([
    Get('activity/by-period'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FiltroReporteDTO]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "operacionesPorPeriodo", null);
__decorate([
    Get('activity/top-actions'),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FiltroReporteDTO]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "principalesAcciones", null);
ReportsController = __decorate([
    Roles(Rol.ADMIN),
    Controller('reports'),
    __metadata("design:paramtypes", [ReportsService])
], ReportsController);
export { ReportsController };
//# sourceMappingURL=reports.controller.js.map