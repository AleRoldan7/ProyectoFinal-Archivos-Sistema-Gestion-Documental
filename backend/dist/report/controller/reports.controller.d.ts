import type { AuthUser } from '../../common/interfaces/auth-user.interface.js';
import { ReportsService } from '../service/reports.service.js';
import { FiltroReporteDTO } from '../dto/filter-report.dto.js';
export declare class ReportsController {
    private readonly reports;
    constructor(reports: ReportsService);
    private usuarioPermitido;
    archivosPorTipo(): import("mongoose").Aggregate<any[]>;
    archivosEnRango(f: FiltroReporteDTO): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../files/schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../../files/schemas/file.schema.js").FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../../files/schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../../files/schemas/file.schema.js").FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../files/schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../../files/schemas/file.schema.js").FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../../files/schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../../files/schemas/file.schema.js").FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("../../files/schemas/file.schema.js").FileEntry, {}, import("mongoose").DefaultSchemaOptions> & import("../../files/schemas/file.schema.js").FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, "find", {}>;
    archivosMasOperados(f: FiltroReporteDTO): import("mongoose").Aggregate<any[]>;
    topUsuarios(f: FiltroReporteDTO): import("mongoose").Aggregate<any[]>;
    usuariosCompartidos(f: FiltroReporteDTO): import("mongoose").Aggregate<any[]>;
    archivosCompartidos(f: FiltroReporteDTO): import("mongoose").Aggregate<any[]>;
    compartidosPor(user: AuthUser, f: FiltroReporteDTO): Promise<any[]>;
    recibidosPor(user: AuthUser, f: FiltroReporteDTO): Promise<any[]>;
    actividadUsuario(user: AuthUser, f: FiltroReporteDTO): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../activity/schemas/activity.schema.js").Activity, {}, import("mongoose").DefaultSchemaOptions> & import("../../activity/schemas/activity.schema.js").Activity & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../../activity/schemas/activity.schema.js").Activity, {}, import("mongoose").DefaultSchemaOptions> & import("../../activity/schemas/activity.schema.js").Activity & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../../activity/schemas/activity.schema.js").Activity, {}, import("mongoose").DefaultSchemaOptions> & import("../../activity/schemas/activity.schema.js").Activity & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, import("../../activity/schemas/activity.schema.js").Activity, {}, import("mongoose").DefaultSchemaOptions> & import("../../activity/schemas/activity.schema.js").Activity & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, import("../../activity/schemas/activity.schema.js").Activity, {}, import("mongoose").DefaultSchemaOptions> & import("../../activity/schemas/activity.schema.js").Activity & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, "find", {}>;
    operacionesPorTipo(f: FiltroReporteDTO): import("mongoose").Aggregate<any[]>;
    operacionesPorPeriodo(f: FiltroReporteDTO): import("mongoose").Aggregate<any[]>;
    principalesAcciones(f: FiltroReporteDTO): import("mongoose").Aggregate<any[]>;
}
