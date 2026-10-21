import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TrashService } from '../../service/trash-service/trash.service';
import { TrashContent } from '../../models/trash/trash';
import { formatBytes, formatDate } from '../../utils/format';
import { confirmar, exito, fallo } from '../../utils/dialogos';

@Component({
  selector: 'app-papelera',
  templateUrl: './papelera.html',
})
export class Papelera implements OnInit {
  private readonly papeleraApi = inject(TrashService);

  readonly formatBytes = formatBytes;
  readonly formatDate = formatDate;

  contenido = signal<TrashContent>({ folders: [], files: [] });
  cargando = signal(true);

  readonly vacia = computed(() => this.contenido().folders.length === 0 && this.contenido().files.length === 0);

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.papeleraApi.list().subscribe({
      next: (c) => {
        this.contenido.set(c);
        this.cargando.set(false);
      },
      error: (e) => {
        this.cargando.set(false);
        fallo(e);
      },
    });
  }

  restaurarCarpeta(id: string): void {
    this.papeleraApi.restoreFolder(id).subscribe({
      next: () => {
        exito('Carpeta restaurada');
        this.cargar();
      },
      error: fallo,
    });
  }

  restaurarArchivo(id: string): void {
    this.papeleraApi.restoreFile(id).subscribe({
      next: () => {
        exito('Archivo restaurado');
        this.cargar();
      },
      error: fallo,
    });
  }

  async eliminarCarpeta(id: string, nombre: string): Promise<void> {
    if (!(await confirmar('Eliminar definitivamente', `"${nombre}" y todo su contenido se borrarán para siempre.`, 'Eliminar', true))) return;
    this.papeleraApi.purgeFolder(id).subscribe({
      next: () => {
        exito('Carpeta eliminada');
        this.cargar();
      },
      error: fallo,
    });
  }

  async eliminarArchivo(id: string, nombre: string): Promise<void> {
    if (!(await confirmar('Eliminar definitivamente', `"${nombre}" se borrará para siempre.`, 'Eliminar', true))) return;
    this.papeleraApi.purgeFile(id).subscribe({
      next: () => {
        exito('Archivo eliminado');
        this.cargar();
      },
      error: fallo,
    });
  }
}
