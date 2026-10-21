import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from '../../service/user-service/user.service';
import { LoginService } from '../../service/login-service/login.service';
import { ETIQUETA_ACCION, ETIQUETA_PERMISO, ETIQUETA_RECURSO, ETIQUETA_TIPO_ARCHIVO, correoDe, detalleLegible, nombreDe } from '../../utils/etiquetas';
import { formatBytes, formatDate } from '../../utils/format';
import { fallo } from '../../utils/dialogos';
import { FiltroReporte } from '../../models/reports/report';
import { ReportService } from '../../service/report-service/report.service';
import { UserResponse } from '../../models/user/user-response';
import { saveCsv } from '../../utils/download';

type CampoFiltro = 'from' | 'to' | 'limit' | 'periodo' | 'usuario';
type Fila = any; // cada reporte devuelve una forma distinta; se tipa en ReportService

interface Columna {
  etiqueta: string;
  valor: (f: Fila) => string | number;
}

interface DefReporte {
  id: string;
  grupo: 'Archivos' | 'Usuarios' | 'Compartidos' | 'Actividad';
  titulo: string;
  descripcion: string;
  filtros: CampoFiltro[];
  soloAdmin: boolean;
  columnas: Columna[];
  /** Si existe, se dibuja una barra proporcional con este valor */
  barra?: (f: Fila) => number;
  cargar: (f: FiltroReporte) => Observable<Fila[]>;
}

@Component({
  selector: 'app-reportes',
  imports: [FormsModule],
  templateUrl: './reportes.html',
})
export class Reportes implements OnInit {
  private readonly api = inject(ReportService);
  private readonly usuariosApi = inject(UserService);

  readonly esAdmin = inject(LoginService).getCurrentUser()?.rol === 'ADMIN';

  private readonly recurso = (f: Fila) => f.resourceName ?? 'No disponible';
  private readonly tipoRecurso = (f: Fila) => ETIQUETA_RECURSO[f.resourceType] ?? f.resourceType;

  readonly reportes: DefReporte[] = [
    // ---------- Archivos ----------
    {
      id: 'archivos-tipo', grupo: 'Archivos', titulo: 'Archivos por tipo', soloAdmin: true, filtros: [],
      descripcion: 'Cantidad de archivos activos agrupados por tipo.',
      columnas: [{ etiqueta: 'Tipo', valor: (f) => ETIQUETA_TIPO_ARCHIVO[f.tipo] ?? f.tipo }, { etiqueta: 'Total', valor: (f) => f.total }],
      barra: (f) => f.total,
      cargar: () => this.api.archivosPorTipo(),
    },
    {
      id: 'archivos-fecha', grupo: 'Archivos', titulo: 'Archivos por rango de fechas', soloAdmin: true, filtros: ['from', 'to'],
      descripcion: 'Archivos creados dentro del rango elegido, con su propietario.',
      columnas: [
        { etiqueta: 'Nombre', valor: (f) => f.name },
        { etiqueta: 'Tipo', valor: (f) => ETIQUETA_TIPO_ARCHIVO[f.fileType] ?? f.fileType },
        { etiqueta: 'Tamaño', valor: (f) => formatBytes(f.size) },
        { etiqueta: 'Propietario', valor: (f) => nombreDe(f.ownerId) },
        { etiqueta: 'Creado', valor: (f) => formatDate(f.createdAt) },
      ],
      cargar: (f) => this.api.archivosEnRango(f),
    },
    {
      id: 'archivos-operados', grupo: 'Archivos', titulo: 'Archivos con más operaciones', soloAdmin: true, filtros: ['limit'],
      descripcion: 'Archivos sobre los que más acciones se han registrado.',
      columnas: [{ etiqueta: 'Archivo', valor: (f) => f.nombre }, { etiqueta: 'Operaciones', valor: (f) => f.operaciones }],
      barra: (f) => f.operaciones,
      cargar: (f) => this.api.archivosMasOperados(f),
    },
    // ---------- Usuarios ----------
    {
      id: 'usuarios-archivos', grupo: 'Usuarios', titulo: 'Usuarios con más archivos', soloAdmin: true, filtros: ['limit'],
      descripcion: 'Ranking de usuarios según la cantidad de archivos que poseen.',
      columnas: [{ etiqueta: 'Usuario', valor: (f) => f.nombre }, { etiqueta: 'Archivos', valor: (f) => f.archivos }],
      barra: (f) => f.archivos,
      cargar: (f) => this.api.topUsuariosConArchivos(f),
    },
    {
      id: 'usuarios-compartidos', grupo: 'Usuarios', titulo: 'Usuarios que más comparten', soloAdmin: true, filtros: ['limit'],
      descripcion: 'Usuarios con más recursos (archivos y carpetas) compartidos.',
      columnas: [{ etiqueta: 'Usuario', valor: (f) => f.nombre }, { etiqueta: 'Recursos compartidos', valor: (f) => f.recursos }],
      barra: (f) => f.recursos,
      cargar: (f) => this.api.usuariosMasCompartidos(f),
    },
    // ---------- Compartidos ----------
    {
      id: 'compartidos-archivos', grupo: 'Compartidos', titulo: 'Archivos compartidos con más usuarios', soloAdmin: true, filtros: ['limit'],
      descripcion: 'Archivos que tienen acceso otorgado a más personas.',
      columnas: [{ etiqueta: 'Archivo', valor: (f) => f.nombre }, { etiqueta: 'Usuarios con acceso', valor: (f) => f.total }],
      barra: (f) => f.total,
      cargar: (f) => this.api.archivosMasCompartidos(f),
    },
    {
      id: 'compartidos-por-usuario', grupo: 'Compartidos', titulo: 'Lo que comparte un usuario', soloAdmin: false, filtros: ['usuario'],
      descripcion: 'Recursos que el usuario ha compartido y con quién.',
      columnas: [
        { etiqueta: 'Recurso', valor: this.recurso },
        { etiqueta: 'Tipo', valor: this.tipoRecurso },
        { etiqueta: 'Compartido con', valor: (f) => `${nombreDe(f.sharedWithId)} (${correoDe(f.sharedWithId)})` },
        { etiqueta: 'Permiso', valor: (f) => ETIQUETA_PERMISO[f.permission] ?? f.permission },
        { etiqueta: 'Fecha', valor: (f) => formatDate(f.createdAt) },
      ],
      cargar: (f) => this.api.compartidosPorUsuario(f),
    },
    {
      id: 'recibidos-por-usuario', grupo: 'Compartidos', titulo: 'Lo que recibe un usuario', soloAdmin: false, filtros: ['usuario'],
      descripcion: 'Recursos que otras personas compartieron con el usuario.',
      columnas: [
        { etiqueta: 'Recurso', valor: this.recurso },
        { etiqueta: 'Tipo', valor: this.tipoRecurso },
        { etiqueta: 'Compartido por', valor: (f) => `${nombreDe(f.ownerId)} (${correoDe(f.ownerId)})` },
        { etiqueta: 'Permiso', valor: (f) => ETIQUETA_PERMISO[f.permission] ?? f.permission },
        { etiqueta: 'Fecha', valor: (f) => formatDate(f.createdAt) },
      ],
      cargar: (f) => this.api.recibidosPorUsuario(f),
    },
    // ---------- Actividad ----------
    {
      id: 'actividad-usuario', grupo: 'Actividad', titulo: 'Historial de un usuario', soloAdmin: false, filtros: ['usuario', 'from', 'to'],
      descripcion: 'Todo lo que hizo el usuario en el rango de fechas.',
      columnas: [
        { etiqueta: 'Fecha', valor: (f) => formatDate(f.createdAt) },
        { etiqueta: 'Acción', valor: (f) => ETIQUETA_ACCION[f.actionActivity] ?? f.actionActivity },
        { etiqueta: 'Tipo', valor: (f) => ETIQUETA_RECURSO[f.resourceType] ?? f.resourceType },
        { etiqueta: 'Detalle', valor: (f) => detalleLegible(f.detail) },
      ],
      cargar: (f) => this.api.actividadDeUsuario(f),
    },
    {
      id: 'actividad-tipo', grupo: 'Actividad', titulo: 'Operaciones por tipo', soloAdmin: true, filtros: ['from', 'to'],
      descripcion: 'Cuántas veces se realizó cada acción.',
      columnas: [{ etiqueta: 'Acción', valor: (f) => ETIQUETA_ACCION[f.tipo] ?? f.tipo }, { etiqueta: 'Total', valor: (f) => f.total }],
      barra: (f) => f.total,
      cargar: (f) => this.api.operacionesPorTipo(f),
    },
    {
      id: 'actividad-periodo', grupo: 'Actividad', titulo: 'Operaciones por periodo', soloAdmin: true, filtros: ['periodo', 'from', 'to'],
      descripcion: 'Volumen de operaciones agrupado por día o por mes.',
      columnas: [{ etiqueta: 'Periodo', valor: (f) => f.periodo }, { etiqueta: 'Total', valor: (f) => f.total }],
      barra: (f) => f.total,
      cargar: (f) => this.api.operacionesPorPeriodo(f),
    },
    {
      id: 'actividad-top', grupo: 'Actividad', titulo: 'Principales acciones', soloAdmin: true, filtros: ['limit'],
      descripcion: 'Las acciones más frecuentes del sistema.',
      columnas: [{ etiqueta: 'Acción', valor: (f) => ETIQUETA_ACCION[f.accion] ?? f.accion }, { etiqueta: 'Total', valor: (f) => f.total }],
      barra: (f) => f.total,
      cargar: (f) => this.api.principalesAcciones(f),
    },
  ];

  readonly disponibles = this.reportes.filter((r) => this.esAdmin || !r.soloAdmin);
  readonly grupos = (['Archivos', 'Usuarios', 'Compartidos', 'Actividad'] as const)
    .map((g) => ({ nombre: g, items: this.disponibles.filter((r) => r.grupo === g) }))
    .filter((g) => g.items.length > 0);

  usuarios = signal<UserResponse[]>([]);
  seleccionado = signal<DefReporte>(this.disponibles[0]);
  filas = signal<Fila[]>([]);
  cargando = signal(false);
  consultado = signal(false);

  filtros = { from: '', to: '', limit: 10, periodo: 'DIA' as 'DIA' | 'MES', userId: '' };

  readonly maximo = computed(() => {
    const barra = this.seleccionado().barra;
    return barra ? Math.max(1, ...this.filas().map(barra)) : 1;
  });

  ngOnInit(): void {
    if (this.esAdmin) {
      this.usuariosApi.todos().subscribe({ next: (u) => this.usuarios.set(u), error: fallo });
    }
    this.consultar();
  }

  tiene(campo: CampoFiltro): boolean {
    return this.seleccionado().filtros.includes(campo);
  }

  elegir(r: DefReporte): void {
    this.seleccionado.set(r);
    this.filas.set([]);
    this.consultado.set(false);
    this.consultar();
  }

  porcentaje(f: Fila): number {
    const barra = this.seleccionado().barra;
    return barra ? Math.round((barra(f) / this.maximo()) * 100) : 0;
  }

  consultar(): void {
    const def = this.seleccionado();
    const filtro: FiltroReporte = {};
    if (def.filtros.includes('from') && this.filtros.from) filtro.from = this.filtros.from;
    if (def.filtros.includes('to') && this.filtros.to) filtro.to = this.filtros.to;
    if (def.filtros.includes('limit')) filtro.limit = this.filtros.limit;
    if (def.filtros.includes('periodo')) filtro.periodo = this.filtros.periodo;
    // solo el admin puede consultar a otro usuario; vacío = su propia cuenta
    if (def.filtros.includes('usuario') && this.esAdmin && this.filtros.userId) filtro.userId = this.filtros.userId;

    this.cargando.set(true);
    def.cargar(filtro).subscribe({
      next: (r) => {
        // evita pintar la respuesta de un reporte que ya no está seleccionado
        if (this.seleccionado() !== def) return;
        this.filas.set(r);
        this.consultado.set(true);
        this.cargando.set(false);
      },
      error: (e) => {
        this.cargando.set(false);
        fallo(e);
      },
    });
  }

  exportarCsv(): void {
    const def = this.seleccionado();
    const encabezados = def.columnas.map((c) => c.etiqueta);
    const datos = this.filas().map((f) => def.columnas.map((c) => c.valor(f)));
    saveCsv(`${def.id}.csv`, encabezados, datos);
  }
}
