import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class RenameFileDTO {
    
    @IsString() @IsNotEmpty() @MaxLength(150)
    @Matches(/^[^/\\]+$/, { message: 'El nombre no puede contener / ni \\' })
    name: string; 
}