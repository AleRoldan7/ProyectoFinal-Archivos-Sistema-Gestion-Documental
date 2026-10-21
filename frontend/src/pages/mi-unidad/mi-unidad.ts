import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, firstValueFrom, forkJoin, Observable, of, Subject } from 'rxjs';
import { FolderService } from '../../service/folder-service/folder.service';
import { FileService } from '../../service/file-service/file.service';
import { TrashService } from '../../service/trash-service/trash.service';
import { Folder, FolderDetail, FolderPathItem } from '../../models/folder/folder';
import { FileResponse } from '../../models/file/file-response';
import { FileType } from '../../models/file/file-type';
import { ResourceType } from '../../models/sharing/share';
import { saveTextAsFile } from '../../utils/download';
import { formatBytes, formatDate } from '../../utils/format';
import { confirmar, exito, fallo, pedirTexto } from '../../utils/dialogos';
import { errorMessage } from '../../utils/http-error';
import { CompartirModal } from '../../components/compartir-modal/compartir-modal';
import { MoverModal } from '../../components/mover-modal/mover-modal';
import { VisorArchivo } from '../../components/visor-archivo/visor-archivo';

const MAX_BYTES = 5 * 1024 * 1024;
const EXTENSIONES = ['.txt', '.md'];

interface RecursoSeleccionado {
  tipo: ResourceType;
  id: string;
  nombre: string;
}

@Component({
  selector: 'app-mi-unidad',
  imports: [RouterLink, FormsModule, CompartirModal, MoverModal, VisorArchivo],
  templateUrl: './mi-unidad.html',
})
export class MiUnidad {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly carpetasApi = inject(FolderService);
  private readonly archivosApi = inject(FileService);
  private readonly papelera = inject(TrashService);

  readonly formatBytes = formatBytes;
  readonly formatDate = formatDate;
  readonly limite = 20;

  carpetaId = signal<string | null>(null);
  carpetas = signal<Folder[]>([]);
  archivos = signal<FileResponse[]>([]);
  ruta = signal<FolderPathItem[]>([]);
  total = signal(0);
  pagina = signal(1);
  cargando = signal(false);
  subiendo = signal(false);
  arrastrando = signal(false);

  busqueda = signal('');
  tipo = signal<FileType | ''>('');
  orden = signal('createdAt:desc');

  archivoAbierto = signal<FileResponse | null>(null);
  paraCompartir = signal<RecursoSeleccionado | null>(null);
  paraMover = signal<RecursoSeleccionado | null>(null);

  private readonly escribiendo$ = new Subject<void>();

  readonly carpetasVisibles = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    return texto ? this.carpetas().filter((c) => c.name.toLowerCase().includes(texto)) : this.carpetas();
  });
  readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.total() / this.limite)));
  readonly vacio = computed(() => !this.cargando() && this.carpetasVisibles().length === 0 && this.archivos().length === 0);

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((p) => {
      this.carpetaId.set(p.get('folderId'));
      this.pagina.set(1);
      this.cargar();
    });

    this.escribiendo$.pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.pagina.set(1);
      this.cargar();
    });
  }

  cargar(): void {
    const id = this.carpetaId();
    const [sortBy, order] = this.orden().split(':') as ['name' | 'createdAt' | 'size', 'asc' | 'desc'];
    const detalle$ = (id ? this.carpetasApi.detail(id) : of(null)) as Observable<FolderDetail | null>;

    this.cargando.set(true);
    forkJoin({
      carpetas: this.carpetasApi.list(id),
      archivos: this.archivosApi.list({
        folderId: id ?? 'root',
        search: this.busqueda().trim(),
        type: this.tipo(),
        sortBy,
        order,
        page: this.pagina(),
        limit: this.limite,
      }),
      detalle: detalle$,
    }).subscribe({
      next: ({ carpetas, archivos, detalle }) => {
        this.carpetas.set(carpetas);
        this.archivos.set(archivos.items);
        this.total.set(archivos.total);
        this.ruta.set(detalle ? [...detalle.path, { _id: detalle.folder._id, name: detalle.folder.name }] : []);
        this.cargando.set(false);
      },
      error: (e) => {
        this.cargando.set(false);
        fallo(e);
        if (id) void this.router.navigate(['/drive']);
      },
    });
  }

  // ---------- filtros ----------
  alEscribirBusqueda(valor: string): void {
    this.busqueda.set(valor);
    this.escribiendo$.next();
  }

  alCambiarFiltro(): void {
    this.pagina.set(1);
    this.cargar();
  }

  irAPagina(n: number): void {
    if (n < 1 || n > this.totalPaginas()) return;
    this.pagina.set(n);
    this.cargar();
  }

  // ---------- carpetas ----------
  async nuevaCarpeta(): Promise<void> {
    const nombre = await pedirTexto('Nueva carpeta');
    if (!nombre) return;
    this.carpetasApi.create(nombre, this.carpetaId()).subscribe({
      next: () => {
        exito('Carpeta creada');
        this.cargar();
      },
      error: fallo,
    });
  }

  async renombrarCarpeta(c: Folder): Promise<void> {
    const nombre = await pedirTexto('Renombrar carpeta', c.name);
    if (!nombre || nombre === c.name) return;
    this.carpetasApi.rename(c._id, nombre).subscribe({
      next: () => {
        exito('Carpeta renombrada');
        this.cargar();
      },
      error: fallo,
    });
  }

  async carpetaALaPapelera(c: Folder): Promise<void> {
    if (!(await confirmar('Enviar a la papelera', `La carpeta "${c.name}" y todo su contenido irán a la papelera.`, 'Enviar', true))) return;
    this.papelera.sendFolder(c._id).subscribe({
      next: () => {
        exito('Carpeta enviada a la papelera');
        this.cargar();
      },
      error: fallo,
    });
  }

  // ---------- archivos ----------
  async subirSeleccion(evento: Event): Promise<void> {
    const input = evento.target as HTMLInputElement;
    const lista = Array.from(input.files ?? []);
    input.value = '';
    await this.subir(lista);
  }

  async soltar(evento: DragEvent): Promise<void> {
    evento.preventDefault();
    this.arrastrando.set(false);
    await this.subir(Array.from(evento.dataTransfer?.files ?? []));
  }

  private async subir(lista: File[]): Promise<void> {
    if (!lista.length) return;
    this.subiendo.set(true);

    let subidos = 0;
    const problemas: string[] = [];

    for (const f of lista) {
      const ext = f.name.includes('.') ? f.name.slice(f.name.lastIndexOf('.')).toLowerCase() : '';
      if (!EXTENSIONES.includes(ext)) {
        problemas.push(`${f.name}: solo se permiten archivos .txt y .md`);
        continue;
      }
      if (f.size > MAX_BYTES) {
        problemas.push(`${f.name}: supera los 5 MB`);
        continue;
      }
      try {
        await firstValueFrom(this.archivosApi.upload(f, this.carpetaId()));
        subidos++;
      } catch (e) {
        problemas.push(`${f.name}: ${errorMessage(e)}`);
      }
    }

    this.subiendo.set(false);
    if (subidos) exito(subidos === 1 ? 'Archivo subido' : `${subidos} archivos subidos`);
    if (problemas.length) fallo(problemas.join('\n'));
    this.cargar();
  }

  descargar(a: FileResponse): void {
    this.archivosApi.getOne(a._id).subscribe({ next: (texto) => saveTextAsFile(texto, a.name), error: fallo });
  }

  async renombrarArchivo(a: FileResponse): Promise<void> {
    const nombre = await pedirTexto('Renombrar archivo (conserva la extensión)', a.name);
    if (!nombre || nombre === a.name) return;
    this.archivosApi.rename(a._id, nombre).subscribe({
      next: () => {
        exito('Archivo renombrado');
        this.cargar();
      },
      error: fallo,
    });
  }

  async archivoALaPapelera(a: FileResponse): Promise<void> {
    if (!(await confirmar('Enviar a la papelera', `"${a.name}" irá a la papelera.`, 'Enviar', true))) return;
    this.papelera.sendFile(a._id).subscribe({
      next: () => {
        exito('Archivo enviado a la papelera');
        this.cargar();
      },
      error: fallo,
    });
  }

  // ---------- compartir y mover ----------
  compartirCarpeta(c: Folder): void {
    this.paraCompartir.set({ tipo: 'FOLDER', id: c._id, nombre: c.name });
  }

  compartirArchivo(a: FileResponse): void {
    this.paraCompartir.set({ tipo: 'FILE', id: a._id, nombre: a.name });
  }

  moverCarpeta(c: Folder): void {
    this.paraMover.set({ tipo: 'FOLDER', id: c._id, nombre: c.name });
  }

  moverArchivo(a: FileResponse): void {
    this.paraMover.set({ tipo: 'FILE', id: a._id, nombre: a.name });
  }

  confirmarMovimiento(destino: string | null): void {
    const r = this.paraMover();
    if (!r) return;
    const peticion: Observable<unknown> = r.tipo === 'FILE' ? this.archivosApi.move(r.id, destino) : this.carpetasApi.move(r.id, destino);
    peticion.subscribe({
      next: () => {
        this.paraMover.set(null);
        exito('Movido correctamente');
        this.cargar();
      },
      error: fallo,
    });
  }
}
