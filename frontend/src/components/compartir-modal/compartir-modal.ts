import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ModalComponent } from '../modal/modal';
import { ShareService } from '../../service/share-service/share.service';
import { UserService } from '../../service/user-service/user.service';
import { LoginService } from '../../service/login-service/login.service';
import { Permission, ResourceType, Share, UserRef } from '../../models/sharing/share';
import { ETIQUETA_PERMISO, PERMISOS, correoDe, nombreDe } from '../../utils/etiquetas';
import { confirmar, exito, fallo } from '../../utils/dialogos';
import { UsuarioDirectorio } from '../../models/user/user-response';

@Component({
  selector: 'app-compartir-modal',
  imports: [FormsModule, ModalComponent],
  templateUrl: './compartir-modal.html',
})
export class CompartirModal implements OnInit {
  tipo = input.required<ResourceType>();
  recursoId = input.required<string>();
  nombre = input.required<string>();
  cerrar = output<void>();

  private readonly comparticiones = inject(ShareService);
  private readonly usuariosApi = inject(UserService);
  private readonly yo = inject(LoginService).getCurrentUser()?.idUser;

  readonly permisos = PERMISOS;
  readonly etiquetaPermiso = ETIQUETA_PERMISO;
  readonly nombreDe = nombreDe;
  readonly correoDe = correoDe;

  usuarios = signal<UsuarioDirectorio[]>([]);
  accesos = signal<Share[]>([]);
  cargando = signal(true);
  enviando = signal(false);

  usuarioElegido = '';
  permisoElegido: Permission = 'READ';

  ngOnInit(): void {
    forkJoin({ usuarios: this.usuariosApi.directorio(), accesos: this.comparticiones.byMe() }).subscribe({
      next: ({ usuarios, accesos }) => {
        this.usuarios.set(usuarios.filter((u) => u._id !== this.yo));
        this.accesos.set(this.filtrarDelRecurso(accesos));
        this.cargando.set(false);
      },
      error: (e) => {
        this.cargando.set(false);
        fallo(e);
      },
    });
  }

  private filtrarDelRecurso(todos: Share[]): Share[] {
    return todos.filter((s) => s.resourceId === this.recursoId() && s.resourceType === this.tipo());
  }

  private recargarAccesos(): void {
    this.comparticiones.byMe().subscribe({ next: (todos) => this.accesos.set(this.filtrarDelRecurso(todos)), error: fallo });
  }

  compartir(): void {
    if (!this.usuarioElegido) {
      fallo('Elige con quién quieres compartir');
      return;
    }
    this.enviando.set(true);
    this.comparticiones
      .create({ resourceType: this.tipo(), resourceId: this.recursoId(), userId: this.usuarioElegido, permission: this.permisoElegido })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.usuarioElegido = '';
          exito('Compartido correctamente');
          this.recargarAccesos();
        },
        error: (e) => {
          this.enviando.set(false);
          fallo(e);
        },
      });
  }

  cambiarPermiso(acceso: Share, permiso: Permission): void {
    this.comparticiones.changePermission(acceso._id, permiso).subscribe({
      next: () => {
        exito('Permiso actualizado');
        this.recargarAccesos();
      },
      error: (e) => {
        fallo(e);
        this.recargarAccesos();
      },
    });
  }

  async revocar(acceso: Share): Promise<void> {
    const quien = nombreDe(acceso.sharedWithId as UserRef);
    if (!(await confirmar('Quitar acceso', `${quien} dejará de ver "${this.nombre()}".`, 'Quitar acceso', true))) return;
    this.comparticiones.revoke(acceso._id).subscribe({
      next: () => {
        exito('Acceso revocado');
        this.recargarAccesos();
      },
      error: fallo,
    });
  }
}
