import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShareService } from '../../service/share-service/share.service';
import { FileService } from '../../service/file-service/file.service';
import { Share } from '../../models/sharing/share';
import { FileResponse } from '../../models/file/file-response';
import { ETIQUETA_PERMISO, ETIQUETA_RECURSO, correoDe, nombreDe } from '../../utils/etiquetas';
import { formatDate } from '../../utils/format';
import { fallo } from '../../utils/dialogos';
import { VisorArchivo } from '../../components/visor-archivo/visor-archivo';
import { ExploradorCarpeta } from '../../components/explorador-carpetas/explorador-carpetas';

@Component({
  selector: 'app-compartidos-conmigo',
  imports: [FormsModule, VisorArchivo, ExploradorCarpeta],
  templateUrl: './compartidos-conmigo.html',
})
export class CompartidosConmigo implements OnInit {
  private readonly comparticiones = inject(ShareService);
  private readonly archivosApi = inject(FileService);

  readonly nombreDe = nombreDe;
  readonly correoDe = correoDe;
  readonly formatDate = formatDate;
  readonly etiquetaPermiso = ETIQUETA_PERMISO;
  readonly etiquetaRecurso = ETIQUETA_RECURSO;

  items = signal<Share[]>([]);
  cargando = signal(true);
  busqueda = signal('');
  archivoAbierto = signal<FileResponse | null>(null);
  puedeEditar = signal(false);

  carpetaAbierta = signal<{ id: string, name: string, permission: string } | null>(null);

  readonly visibles = computed(() => {
    const t = this.busqueda().trim().toLowerCase();
    if (!t) return this.items();
    return this.items().filter((s) => (s.resourceName ?? '').toLowerCase().includes(t) || nombreDe(s.ownerId).toLowerCase().includes(t));
  });

  ngOnInit(): void {
    this.comparticiones.withMe().subscribe({
      next: (r) => {
        this.items.set(r);
        this.cargando.set(false);
      },
      error: (e) => {
        this.cargando.set(false);
        fallo(e);
      },
    });
  }

  abrir(s: Share): void {
    if (s.resourceType === 'FILE') {
      this.archivosApi.metadatos(s.resourceId).subscribe({
        next: (archivo) => {
          this.puedeEditar.set(s.permission === 'EDIT');
          this.archivoAbierto.set(archivo);
        },
        error: fallo,
      });
    } else if (s.resourceType === 'FOLDER') {
      this.carpetaAbierta.set({
        id: s.resourceId,
        name: s.resourceName ?? 'Carpeta compartida',
        permission: s.permission
      });
    }
  }

  cerrarCarpeta() {
    this.carpetaAbierta.set(null);
  }
}
