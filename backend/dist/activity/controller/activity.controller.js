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
import { Controller, Get, Query } from "@nestjs/common";
import { ActivityService } from "../service/activity.service.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { Rol } from "../../common/enums/rol.enum.js";
import { ListActivityDTO } from "../dto/list-activity.dto.js";
let ActivityController = class ActivityController {
    activityService;
    constructor(activityService) {
        this.activityService = activityService;
    }
    list(user, query) {
        const userId = user.rol === Rol.ADMIN ? query.userId : user.idUser;
        const { action, ...resto } = query;
        return this.activityService.consult({ ...resto, actionActivity: action, userId });
    }
};
__decorate([
    Get(),
    __param(0, CurrentUser()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ListActivityDTO]),
    __metadata("design:returntype", void 0)
], ActivityController.prototype, "list", null);
ActivityController = __decorate([
    Controller('activity'),
    __metadata("design:paramtypes", [ActivityService])
], ActivityController);
export { ActivityController };
//# sourceMappingURL=activity.controller.js.map