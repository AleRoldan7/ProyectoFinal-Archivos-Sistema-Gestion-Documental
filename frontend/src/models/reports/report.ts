import { FileType } from "../file/file-type";

export interface FiltroReporte {
  from?: string;
  to?: string;
  userId?: string;
  periodo?: "DIA" | "MES";
  limit?: number;
}

export interface PropietarioRef {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface FilaArchivoRango {
  _id: string;
  name: string;
  fileType: FileType;
  size: number;
  createdAt: string;
  ownerId: PropietarioRef | null;
}

export interface FilaTipoArchivo { tipo: string; total: number }
export interface FilaArchivoOperado { archivoId: string; nombre: string; operaciones: number }
export interface FilaUsuarioArchivos { usuarioId: string; nombre: string; archivos: number }
export interface FilaUsuarioCompartidos { usuarioId: string; nombre: string; recursos: number }
export interface FilaArchivoCompartido { archivoId: string; nombre: string; total: number }
export interface FilaOperacionTipo { tipo: string; total: number }
export interface FilaOperacionPeriodo { periodo: string; total: number }
export interface FilaAccionTop { accion: string; total: number }