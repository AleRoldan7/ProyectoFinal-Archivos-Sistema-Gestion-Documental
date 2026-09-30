import { IsMongoId, ValidateIf } from "class-validator";

export class MoveFolderDTO {

    @ValidateIf((o) => o.parentId !== null)
    @IsMongoId()
    parentId: string | null;
}