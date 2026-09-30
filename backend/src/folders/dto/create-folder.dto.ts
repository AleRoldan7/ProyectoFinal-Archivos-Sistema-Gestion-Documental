import { IsMongoId, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator";

export class CreateFolderDTO {

    @IsString() @IsNotEmpty() @MaxLength(100)
    @Matches(/^[^/\\]+$/, { message: 'El nombre no puede contener / ni \\' })
    name: string;

    @IsOptional() @IsMongoId()
    parentId?: string;
}