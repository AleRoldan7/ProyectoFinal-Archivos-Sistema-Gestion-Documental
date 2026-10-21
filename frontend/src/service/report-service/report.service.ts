import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RestConst } from '../../shared/rest-api-const';
import { FilaAccionTop, FilaArchivoCompartido, FilaArchivoOperado, FilaArchivoRango, FilaOperacionPeriodo, FilaOperacionTipo, FilaTipoArchivo, FilaUsuarioArchivos, FilaUsuarioCompartidos, FiltroReporte } from '../../models/reports/report';
import { Share } from '../../models/sharing/share';
import { ActivityResponse } from '../../models/activity/activity-response';
import { toParams } from '../../utils/params';

@Injectable({
  providedIn: 'root',
})
export class ReportService {

   private readonly http = inject(HttpClient);
  private readonly url = new RestConst().getApiUrl() + "/reports";

  private get<T>(ruta: string, filtro: FiltroReporte = {}) {
    return this.http.get<T>(`${this.url}/${ruta}`, { params: toParams(filtro) });
  }

  archivosPorTipo() { return this.get<FilaTipoArchivo[]>("files/by-type"); }
  archivosEnRango(f: FiltroReporte) { return this.get<FilaArchivoRango[]>("files/by-date", f); }
  archivosMasOperados(f: FiltroReporte) { return this.get<FilaArchivoOperado[]>("files/most-operated", f); }
  topUsuariosConArchivos(f: FiltroReporte) { return this.get<FilaUsuarioArchivos[]>("users/top-files", f); }
  usuariosMasCompartidos(f: FiltroReporte) { return this.get<FilaUsuarioCompartidos[]>("users/most-shared", f); }
  archivosMasCompartidos(f: FiltroReporte) { return this.get<FilaArchivoCompartido[]>("shares/most-shared-files", f); }
  compartidosPorUsuario(f: FiltroReporte) { return this.get<Share[]>("shares/by-user", f); }
  recibidosPorUsuario(f: FiltroReporte) { return this.get<Share[]>("shares/received", f); }
  actividadDeUsuario(f: FiltroReporte) { return this.get<ActivityResponse[]>("activity/user", f); }
  operacionesPorTipo(f: FiltroReporte) { return this.get<FilaOperacionTipo[]>("activity/by-type", f); }
  operacionesPorPeriodo(f: FiltroReporte) { return this.get<FilaOperacionPeriodo[]>("activity/by-period", f); }
  principalesAcciones(f: FiltroReporte) { return this.get<FilaAccionTop[]>("activity/top-actions", f); }
}
