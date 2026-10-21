import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { forkJoin, of, Observable } from 'rxjs';
import { ModalComponent } from '../modal/modal';
import { FolderService } from '../../service/folder-service/folder.service';
import { Folder, FolderDetail, FolderPathItem } from '../../models/folder/folder';
import { fallo } from '../../utils/dialogos';

@Component({
  selector: 'app-mover-modal',
  imports: [ModalComponent],
  templateUrl: './mover-modal.html',
})
export class MoverModal implements OnInit {
  tipo = input.required<'FILE' | 'FOLDER'>();
  recursoId = input.required<string>();
  nombre = input.required<string>();
  /** Carpeta donde está ahora (null = raíz) */
  ubicacionActual = input<string | null>(null);

  moverA = output<string | null>();
  cerrar = output<void>();

  private readonly carpetasApi = inject(FolderService);

  destinoId = signal<string | null>(null);
  carpetas = signal<Folder[]>([]);
  ruta = signal<FolderPathItem[]>([]);
  cargando = signal(false);

  ngOnInit(): void {
    this.entrarA(null);
  }

  entrarA(id: string | null): void {
    this.cargando.set(true);
    const detalle$ = (id ? this.carpetasApi.detail(id) : of(null)) as Observable<FolderDetail | null>;
    forkJoin({ lista: this.carpetasApi.list(id), detalle: detalle$ }).subscribe({
      next: ({ lista, detalle }) => {
        // una carpeta no puede moverse dentro de sí misma
        this.carpetas.set(this.tipo() === 'FOLDER' ? lista.filter((c) => c._id !== this.recursoId()) : lista);
        this.ruta.set(detalle ? [...detalle.path, { _id: detalle.folder._id, name: detalle.folder.name }] : []);
        this.destinoId.set(id);
        this.cargando.set(false);
      },
      error: (e) => {
        this.cargando.set(false);
        fallo(e);
      },
    });
  }

  get esMismaUbicacion(): boolean {
    return this.destinoId() === this.ubicacionActual();
  }

  confirmar(): void {
    this.moverA.emit(this.destinoId());
  }
}
