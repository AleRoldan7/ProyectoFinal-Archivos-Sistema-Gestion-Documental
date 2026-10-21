import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal';
import { FileService } from '../../service/file-service/file.service';
import { FileResponse } from '../../models/file/file-response';
import { saveTextAsFile } from '../../utils/download';
import { exito, fallo } from '../../utils/dialogos';
import { formatBytes } from '../../utils/format';

@Component({
  selector: 'app-visor-archivo',
  imports: [FormsModule, ModalComponent],
  templateUrl: './visor-archivo.html',
})
export class VisorArchivo implements OnInit {
  archivo = input.required<FileResponse>();
  puedeEditar = input(false);
  cerrar = output<void>();
  guardado = output<void>();

  private readonly archivosApi = inject(FileService);
  readonly formatBytes = formatBytes;

  texto = signal('');
  cargando = signal(true);
  editando = signal(false);
  guardando = signal(false);
  borrador = '';

  ngOnInit(): void {
    this.archivosApi.getOne(this.archivo()._id).subscribe({
      next: (t) => {
        this.texto.set(t);
        this.cargando.set(false);
      },
      error: (e) => {
        this.cargando.set(false);
        fallo(e);
        this.cerrar.emit();
      },
    });
  }

  descargar(): void {
    saveTextAsFile(this.texto(), this.archivo().name);
  }

  empezarEdicion(): void {
    this.borrador = this.texto();
    this.editando.set(true);
  }

  cancelarEdicion(): void {
    this.editando.set(false);
  }

  guardar(): void {
    this.guardando.set(true);
    this.archivosApi.replaceContent(this.archivo()._id, this.borrador, this.archivo().name).subscribe({
      next: () => {
        this.texto.set(this.borrador);
        this.editando.set(false);
        this.guardando.set(false);
        exito('Cambios guardados');
        this.guardado.emit();
      },
      error: (e) => {
        this.guardando.set(false);
        fallo(e);
      },
    });
  }
}
