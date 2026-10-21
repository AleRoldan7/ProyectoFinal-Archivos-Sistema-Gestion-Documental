import { Controller, Get, Query } from "@nestjs/common";
import { ActivityService } from "../service/activity.service.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import type { AuthUser } from "../../common/interfaces/auth-user.interface.js";
import { Rol } from "../../common/enums/rol.enum.js";
import { ListActivityDTO } from "../dto/list-activity.dto.js";

@Controller('activity')
export class ActivityController {

    constructor(private readonly activityService: ActivityService) {}

    @Get()
    list(@CurrentUser() user: AuthUser, @Query() query: ListActivityDTO) {
        const userId = user.rol === Rol.ADMIN ? query.userId : user.idUser;
        const { action, ...resto } = query;
        return this.activityService.consult({ ...resto, actionActivity: action, userId });
    }
}