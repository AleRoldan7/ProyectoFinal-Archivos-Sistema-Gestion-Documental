import { IsEmail, IsEnum, IsNotEmpty, IsString, IsOptional, MinLength } from "class-validator";
import { Rol } from "../../common/enums/rol.enum.js";

export class UpdateUserDTO {

    @IsOptional() @IsString() @IsNotEmpty()
    firstName?: string;

    @IsOptional() @IsString() @IsNotEmpty()
    lastName?: string;

    @IsOptional() @IsEmail()
    email?: string;

    @IsOptional() @IsString() @MinLength(5)
    password?: string;

    @IsOptional() @IsEnum(Rol)
    rol?: Rol;
}
