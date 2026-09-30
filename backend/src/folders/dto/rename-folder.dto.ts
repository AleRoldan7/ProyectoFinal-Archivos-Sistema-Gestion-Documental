import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";

export class RenameFolderDTO {

    @IsString() @IsNotEmpty() @MaxLength(100)
    @Matches(/^[^/\\]+$/, { message: 'El nombre no puede contener / ni \\' })
    name: string;
}