import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../service/activity-service/activity.service';
import { LoginService } from '../../service/login-service/login.service';
import { ACTION, ActionActivity, ActivityResponse } from '../../models/activity/activity-response';
import { ETIQUETA_ACCION, ETIQUETA_RECURSO, detalleLegible, nombreDe } from '../../utils/etiquetas';
import { formatDate } from '../../utils/format';
import { fallo } from '../../utils/dialogos';
import { UserService } from '../../service/user-service/user.service';
import { UserResponse } from '../../models/user/user-response';

@Component({
  selector: 'app-actividad',
  imports: [FormsModule],
  templateUrl: './actividad.html',
})
export class Actividad implements OnInit {
  private readonly actividadApi = inject(ActivityService);
  private readonly usuariosApi = inject(UserService);

  readonly esAdmin = inject(LoginService).getCurrentUser()?.rol === 'ADMIN';
  readonly acciones = ACTION;
  readonly etiquetaAccion = ETIQUETA_ACCION;
  readonly etiquetaRecurso = ETIQUETA_RECURSO;
  readonly detalleLegible = detalleLegible;
  readonly formatDate = formatDate;
  readonly limite = 15;

  items = signal<ActivityResponse[]>([]);
  usuarios = signal<UserResponse[]>([]);
  total = signal(0);
  pagina = signal(1);
  cargando = signal(true);

  usuarioFiltro = '';
  accionFiltro: ActionActivity | '' = '';
  desde = '';
  hasta = '';

  readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.total() / this.limite)));
  readonly nombrePorId = computed(() => new Map(this.usuarios().map((u) => [u.idUser, nombreDe(u)])));

  ngOnInit(): void {
    if (this.esAdmin) {
      this.usuariosApi.todos().subscribe({ next: (u) => this.usuarios.set(u), error: fallo });
    }
    this.cargar();
  }

  nombreAccion(accion: string): string {
    return this.etiquetaAccion[accion] || accion;
  }

  nombreRecurso(tipo: string): string {
    return this.etiquetaRecurso[tipo] || tipo;
  }

  nombreUsuario(id: string): string {
    return this.nombrePorId().get(id) ?? '—';
  }

  buscar(): void {
    this.pagina.set(1);
    this.cargar();
  }

  limpiar(): void {
    this.usuarioFiltro = '';
    this.accionFiltro = '';
    this.desde = '';
    this.hasta = '';
    this.buscar();
  }

  irAPagina(n: number): void {
    if (n < 1 || n > this.totalPaginas()) return;
    this.pagina.set(n);
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.actividadApi
      .list({
        userId: this.esAdmin ? this.usuarioFiltro : undefined,
        action: this.accionFiltro,
        from: this.desde,
        to: this.hasta,
        page: this.pagina(),
        limit: this.limite,
      })
      .subscribe({
        next: (r) => {
          this.items.set(r.items);
          this.total.set(r.total);
          this.cargando.set(false);
        },
        error: (e) => {
          this.cargando.set(false);
          fallo(e);
        },
      });
  }
}
