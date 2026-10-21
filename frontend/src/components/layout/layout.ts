import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginService } from '../../service/login-service/login.service';

interface OpcionMenu {
  ruta: string;
  etiqueta: string;
  icono: string;
  soloAdmin?: boolean;
}

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
})
export class LayoutComponent {
  private readonly login = inject(LoginService);
  private readonly router = inject(Router);

  readonly usuario = this.login.getCurrentUser();
  readonly esAdmin = this.usuario?.rol === 'ADMIN';

  readonly opciones: OpcionMenu[] = [
    { ruta: '/drive', etiqueta: 'Mi unidad', icono: '📁' },
    { ruta: '/compartidos-conmigo', etiqueta: 'Compartido conmigo', icono: '📥' },
    { ruta: '/compartidos-por-mi', etiqueta: 'Compartido por mí', icono: '📤' },
    { ruta: '/papelera', etiqueta: 'Papelera', icono: '🗑️' },
    { ruta: '/actividad', etiqueta: 'Actividad', icono: '🕑' },
    { ruta: '/reportes', etiqueta: 'Reportes', icono: '📊' },
    { ruta: '/usuarios', etiqueta: 'Usuarios', icono: '👥', soloAdmin: true },
  ];

  get opcionesVisibles(): OpcionMenu[] {
    return this.opciones.filter((o) => !o.soloAdmin || this.esAdmin);
  }

  salir(): void {
    this.login.logout();
    void this.router.navigateByUrl('/login');
  }
}
