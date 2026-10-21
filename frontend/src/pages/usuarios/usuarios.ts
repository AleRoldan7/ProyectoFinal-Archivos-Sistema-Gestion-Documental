import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../service/user-service/user.service';
import { LoginService } from '../../service/login-service/login.service';
import { ModalComponent } from '../../components/modal/modal';
import { confirmar, exito, fallo } from '../../utils/dialogos';
import { formatDate } from '../../utils/format';
import { UserResponse, UsuarioCambios } from '../../models/user/user-response';

@Component({
  selector: 'app-usuarios',
  imports: [ReactiveFormsModule, ModalComponent],
  templateUrl: './usuarios.html',
})
export class Usuarios implements OnInit {
  private readonly usuariosApi = inject(UserService);
  private readonly fb = inject(FormBuilder);
  private readonly yo = inject(LoginService).getCurrentUser()?.idUser;

  readonly formatDate = formatDate;

  usuarios = signal<UserResponse[]>([]);
  cargando = signal(true);
  guardando = signal(false);
  busqueda = signal('');
  modalAbierto = signal(false);
  editando = signal<UserResponse | null>(null);

  readonly visibles = computed(() => {
    const t = this.busqueda().trim().toLowerCase();
    if (!t) return this.usuarios();
    return this.usuarios().filter((u) => `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(t));
  });

  form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    rol: ['USUARIO'],
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.usuariosApi.todos().subscribe({
      next: (u) => {
        this.usuarios.set(u);
        this.cargando.set(false);
      },
      error: (e) => {
        this.cargando.set(false);
        fallo(e);
      },
    });
  }

  esYo(u: UserResponse): boolean {
    return u.idUser === this.yo;
  }

  abrirCrear(): void {
    this.editando.set(null);
    this.form.reset({ firstName: '', lastName: '', email: '', password: '', rol: 'USUARIO' });
    this.form.controls.password.setValidators([Validators.required, Validators.minLength(5)]);
    this.form.controls.password.updateValueAndValidity();
    this.modalAbierto.set(true);
  }

  abrirEditar(u: UserResponse): void {
    this.editando.set(u);
    this.form.reset({ firstName: u.firstName, lastName: u.lastName, email: u.email, password: '', rol: u.rol });
    this.form.controls.password.setValidators([Validators.minLength(5)]);
    this.form.controls.password.updateValueAndValidity();
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const enEdicion = this.editando();
    this.guardando.set(true);

    const alTerminar = {
      next: () => {
        this.guardando.set(false);
        this.modalAbierto.set(false);
        exito(enEdicion ? 'Usuario actualizado' : 'Usuario creado');
        this.cargar();
      },
      error: (e: unknown) => {
        this.guardando.set(false);
        fallo(e);
      },
    };

    if (enEdicion) {
      const cambios: UsuarioCambios = { firstName: v.firstName, lastName: v.lastName, email: v.email, rol: v.rol };
      if (v.password) cambios.password = v.password;
      this.usuariosApi.actualizar(enEdicion.idUser, cambios).subscribe(alTerminar);
    } else {
      this.usuariosApi.crear({ firstName: v.firstName, lastName: v.lastName, email: v.email, password: v.password, rol: v.rol }).subscribe(alTerminar);
    }
  }

  async alternarEstado(u: UserResponse): Promise<void> {
    const activar = !u.stateUser;
    const ok = await confirmar(
      activar ? 'Activar usuario' : 'Desactivar usuario',
      activar ? `${u.firstName} podrá iniciar sesión de nuevo.` : `${u.firstName} ya no podrá iniciar sesión.`,
      activar ? 'Activar' : 'Desactivar',
      !activar,
    );
    if (!ok) return;
    this.usuariosApi.cambiarEstado(u.idUser, activar).subscribe({
      next: () => {
        exito(activar ? 'Usuario activado' : 'Usuario desactivado');
        this.cargar();
      },
      error: fallo,
    });
  }
}
