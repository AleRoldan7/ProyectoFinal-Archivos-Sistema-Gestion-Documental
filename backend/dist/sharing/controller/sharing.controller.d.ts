import type { AuthUser } from '../../common/interfaces/auth-user.interface.js';
import { SharingService } from '../service/sharing.service.js';
import { CreateShareDTO, UpdateShareDTO } from '../dto/share.dto.js';
export declare class SharingController {
    private readonly sharing;
    constructor(sharing: SharingService);
    compartir(user: AuthUser, dto: CreateShareDTO): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/share.schema.js").Share, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/share.schema.js").Share & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/share.schema.js").Share, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/share.schema.js").Share & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    conmigo(user: AuthUser): Promise<any[]>;
    porMi(user: AuthUser): Promise<any[]>;
    cambiar(user: AuthUser, id: string, dto: UpdateShareDTO): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../schemas/share.schema.js").Share, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/share.schema.js").Share & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../schemas/share.schema.js").Share, {}, import("mongoose").DefaultSchemaOptions> & import("../schemas/share.schema.js").Share & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    revocar(user: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
}
