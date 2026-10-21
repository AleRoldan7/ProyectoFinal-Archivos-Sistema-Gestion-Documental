export const ETIQUETA_ACCION: Record<string, string> = {
  LOGIN: "Inicio de sesión",
  CREATE_FOLDER: "Carpeta creada",
  RENAME_FOLDER: "Carpeta renombrada",
  MOVE_FOLDER: "Carpeta movida",
  UPLOAD_FILE: "Archivo subido",
  DOWNLOAD_FILE: "Archivo descargado",
  EDIT_FILE: "Archivo editado",
  RENAME_FILE: "Archivo renombrado",
  MOVE_FILE: "Archivo movido",
  MOVE_TO_TRASH: "Enviado a la papelera",
  RESTORE: "Restaurado",
  PERMANENTLY_DELETE: "Eliminado definitivamente",
  SHARE: "Compartido",
  CHANGE_PERMISSION: "Permiso cambiado",
  REVOKE_PERMISSION: "Acceso revocado",
};

export const ETIQUETA_PERMISO: Record<string, string> = {
  READ: "Lector",
  COMMENT: "Comentarista",
  EDIT: "Editor",
};

export const ETIQUETA_RECURSO: Record<string, string> = {
  FILE: "Archivo",
  FOLDER: "Carpeta",
  SHARE: "Compartición",
  USER: "Usuario",
};

export const ETIQUETA_TIPO_ARCHIVO: Record<string, string> = {
  txt: "Texto (.txt)",
  md: "Markdown (.md)",
};

export const PERMISOS = ["READ", "COMMENT", "EDIT"] as const;

type PersonaRef = { firstName?: string; lastName?: string; email?: string } | string | null | undefined;

/** Muestra "Nombre Apellido" a partir de un usuario poblado. Nunca muestra ids. */
export function nombreDe(persona: PersonaRef): string {
  if (!persona || typeof persona === "string") return "—";
  const completo = `${persona.firstName ?? ""} ${persona.lastName ?? ""}`.trim();
  return completo || persona.email || "—";
}

export function correoDe(persona: PersonaRef): string {
  if (!persona || typeof persona === "string") return "";
  return persona.email ?? "";
}

/** El detalle de la actividad guarda el nombre del recurso o el permiso otorgado. */
export function detalleLegible(detalle: string | null | undefined): string {
  if (!detalle) return "—";
  return ETIQUETA_PERMISO[detalle] ?? detalle;
}
