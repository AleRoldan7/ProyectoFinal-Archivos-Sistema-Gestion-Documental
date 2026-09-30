import { IsMongoId, IsOptional } from 'class-validator';

export class ListFolderQueryDTO {
    
    @IsOptional() @IsMongoId()
    parentId?: string;
}