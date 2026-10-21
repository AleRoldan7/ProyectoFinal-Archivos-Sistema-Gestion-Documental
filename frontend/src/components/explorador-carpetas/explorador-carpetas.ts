import { Component, inject, input, effect, output, signal } from '@angular/core';
import { FolderService } from '../../service/folder-service/folder.service';
import { FileService } from '../../service/file-service/file.service';
import { Folder } from '../../models/folder/folder';
import { FileResponse } from '../../models/file/file-response';
import { VisorArchivo } from '../visor-archivo/visor-archivo';
import { formatDate } from '../../utils/format';
import { fallo } from '../../utils/dialogos';

@Component({
  selector: 'app-explorador-carpeta',
  imports: [VisorArchivo],
  templateUrl: './explorador-carpetas.html',
})
export class ExploradorCarpeta {
  folderId = input.required<string>();
  folderName = input.required<string>();
  permiso = input<string>('READ');
  cerrar = output<void>();

  private readonly foldersApi = inject(FolderService);
  private readonly archivosApi = inject(FileService);

  subcarpetas = signal<Folder[]>([]);
  archivos = signal<FileResponse[]>([]);
  cargando = signal(true);

  archivoAbierto = signal<FileResponse | null>(null);
  puedeEditar = signal(false);

  constructor() {
    // effect se ejecuta cada vez que cambian los signals involucrados (como folderId)
    effect(() => {
      const id = this.folderId();
      const perm = this.permiso();
      
      if (id) {
        this.puedeEditar.set(perm === 'EDIT');
        this.cargarContenido(id);
      }
    }, { allowSignalWrites: true }); // Necesario para poder escribir en otros signals
  }

  cargarContenido(id: string) {
    this.cargando.set(true);

    this.foldersApi.list(id).subscribe({
      next: (carpetas) => this.subcarpetas.set(carpetas),
      error: fallo
    });

    this.archivosApi.list({ folderId: id }).subscribe({
      next: (res) => {
        this.archivos.set(res.items);
        this.cargando.set(false);
      },
      error: (e) => {
        fallo(e);
        this.cargando.set(false);
      }
    });
  }

  abrirArchivo(a: FileResponse) {
    this.archivoAbierto.set(a);
  }

  readonly formatDate = formatDate;
}