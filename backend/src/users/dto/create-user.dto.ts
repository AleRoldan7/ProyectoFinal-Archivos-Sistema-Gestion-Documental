import { IsEmail, IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Rol } from '../../common/enums/rol.enum.js';

export class CreateUserDTO {

    @IsString() @IsNotEmpty()    
    firstName: string;

    @IsString() @IsNotEmpty()    
    lastName: string;

    @IsEmail()
    email: string;

    @IsString() @MinLength(5)
    password: string;

    @IsEnum(Rol)
    rol: Rol;

}