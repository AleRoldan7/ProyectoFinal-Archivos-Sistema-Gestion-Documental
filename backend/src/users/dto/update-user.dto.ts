import { IsEmail, IsEnum, IsInt, IsString, Min, MinLength } from "class-validator";
import { Rol } from "../../common/enums/rol.enum.js";

export class UpdateUserDTO {

    @IsEmail()
    email: string;

    @IsString() @MinLength(5)
    password: string;

    @IsEnum(Rol)
    rol: Rol;
}