import { IsMongoId, ValidateIf } from 'class-validator';

export class MoveFileDTO {

    @ValidateIf((o) => o.folderId !== null)
    @IsMongoId()
    folderId: string | null;
}