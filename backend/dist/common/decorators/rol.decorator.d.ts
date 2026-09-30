import { Rol } from '../enums/rol.enum.js';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: Rol[]) => import("@nestjs/common").CustomDecorator<string>;
