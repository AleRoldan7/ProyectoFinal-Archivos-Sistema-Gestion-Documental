import { Model } from 'mongoose';
import { FileEntry, FileEntryDocument } from '../../files/schemas/file.schema.js';
import { ShareDocument } from '../../sharing/schemas/share.schema.js';
import { Activity, ActivityDocument } from '../../activity/schemas/activity.schema.js';
import { FolderDocument } from '../../folders/schemas/folder.schema.js';
export declare class ReportsService {
    private readonly files;
    private readonly folders;
    private readonly shares;
    private readonly activities;
    constructor(files: Model<FileEntryDocument>, folders: Model<FolderDocument>, shares: Model<ShareDocument>, activities: Model<ActivityDocument>);
    archivosPorTipo(): import("mongoose").Aggregate<any[]>;
    archivosEnRango(from?: string, to?: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, FileEntry, {}, import("mongoose").DefaultSchemaOptions> & FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, FileEntry, {}, import("mongoose").DefaultSchemaOptions> & FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, FileEntry, {}, import("mongoose").DefaultSchemaOptions> & FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, FileEntry, {}, import("mongoose").DefaultSchemaOptions> & FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, FileEntry, {}, import("mongoose").DefaultSchemaOptions> & FileEntry & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, "find", {}>;
    archivosMasOperados(limit?: number): import("mongoose").Aggregate<any[]>;
    topUsuariosConArchivos(limit?: number): import("mongoose").Aggregate<any[]>;
    usuariosConMasRecursosCompartidos(limit?: number): import("mongoose").Aggregate<any[]>;
    archivosCompartidosConMasUsuarios(limit?: number): import("mongoose").Aggregate<any[]>;
    compartidosPorUsuario(userId: string): Promise<any[]>;
    recibidosPorUsuario(userId: string): Promise<any[]>;
    actividadDeUsuario(userId: string, from?: string, to?: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Activity, {}, import("mongoose").DefaultSchemaOptions> & Activity & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Activity, {}, import("mongoose").DefaultSchemaOptions> & Activity & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[], import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Activity, {}, import("mongoose").DefaultSchemaOptions> & Activity & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").Document<unknown, {}, Activity, {}, import("mongoose").DefaultSchemaOptions> & Activity & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>, {}, import("mongoose").Document<unknown, {}, Activity, {}, import("mongoose").DefaultSchemaOptions> & Activity & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }, "find", {}>;
    operacionesPorTipo(from?: string, to?: string): import("mongoose").Aggregate<any[]>;
    operacionesPorPeriodo(periodo?: 'DIA' | 'MES', from?: string, to?: string): import("mongoose").Aggregate<any[]>;
    principalesAcciones(limit?: number): import("mongoose").Aggregate<any[]>;
}
