import { Permission, ResourceType } from "../../common/enums/shraing.enum.js";
import { ShareDocument } from "../schemas/share.schema.js";
import { FolderDocument } from "../../folders/schemas/folder.schema.js";
import { FileEntryDocument } from "../../files/schemas/file.schema.js";
import { Model } from "mongoose";
export type EffectiveLeave = 'OWNER' | Permission;
export declare class AccessService {
    private readonly shareModel;
    private readonly folderModel;
    private readonly fileModel;
    constructor(shareModel: Model<ShareDocument>, folderModel: Model<FolderDocument>, fileModel: Model<FileEntryDocument>);
    effectiveLeave(userId: string, resourceType: ResourceType, id: string): Promise<EffectiveLeave | null>;
    require(userId: string, tipo: ResourceType, id: string, minimo: Permission): Promise<EffectiveLeave>;
}
