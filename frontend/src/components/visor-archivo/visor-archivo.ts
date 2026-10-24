import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal';
import { FileService } from '../../service/file-service/file.service';
import { FileResponse } from '../../models/file/file-response';
import { Comentario } from '../../models/comment/comentario';
import { saveTextAsFile } from '../../utils/download';
import { confirmar, exito, fallo } from '../../utils/dialogos';
import { formatBytes } from '../../utils/format';

@Component({
  selector: 'app-visor-archivo',
  imports: [FormsModule, ModalComponent, DatePipe],
  templateUrl: './visor-archivo.html',
})
export class VisorArchivo implements OnInit {
  archivo = input.required<FileResponse>();
  puedeEditar = input(false);
  puedeComentar = input(false);
  cerrar = output<void>();
  guardado = output<void>();

  private readonly archivosApi = inject(FileService);
  readonly formatBytes = formatBytes;

  texto = signal('');
  cargando = signal(true);
  editando = signal(false);
  guardando = signal(false);
  borrador = '';

  comentarios = signal<Comentario[]>([]);
  nuevoComentario = '';
  enviandoComentario = signal(false);

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
    this.cargarComentarios();
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

  cargarComentarios(): void {
    this.archivosApi.listComments(this.archivo()._id).subscribe({
      next: (lista) => this.comentarios.set(lista),
      error: (e) => fallo(e),
    });
  }

  enviarComentario(): void {
    const texto = this.nuevoComentario.trim();
    if (!texto) return;
    this.enviandoComentario.set(true);
    this.archivosApi.addComment(this.archivo()._id, texto).subscribe({
      next: () => {
        this.nuevoComentario = '';
        this.enviandoComentario.set(false);
        this.cargarComentarios();
      },
      error: (e) => {
        this.enviandoComentario.set(false);
        fallo(e);
      },
    });
  }

  async eliminarComentario(c: Comentario): Promise<void> {
    const ok = await confirmar('¿Eliminar comentario?', 'Esta acción no se puede deshacer.', 'Eliminar', true);
    if (!ok) return;
    this.archivosApi.deleteComment(this.archivo()._id, c._id).subscribe({
      next: () => this.cargarComentarios(),
      error: (e) => fallo(e),
    });
  }
}
