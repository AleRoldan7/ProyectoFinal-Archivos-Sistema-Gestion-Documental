import { IsMongoId, IsOptional } from 'class-validator';

export class UploadFileDTO {

    @IsOptional() @IsMongoId()
    folderId?: string;
}