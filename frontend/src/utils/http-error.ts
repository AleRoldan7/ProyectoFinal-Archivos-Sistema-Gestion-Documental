import { HttpErrorResponse } from '@angular/common/http';

export function errorMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    if (err.status === 0) return 'No se pudo conectar con el servidor';
    const m = err.error?.message;
    if (Array.isArray(m)) return m.join(', ');
    if (typeof m === 'string') return m;
    if (err.status === 403) return 'No tienes permiso para esta acción';
    if (err.status === 404) return 'Recurso no encontrado';
  }
  return 'Ocurrió un error inesperado';
}
