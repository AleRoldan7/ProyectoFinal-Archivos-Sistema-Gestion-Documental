import { Component, inject } from '@angular/core';
import { LoginService } from '../../service/login-service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  template: `
    <main>
      <h1>Gestión documental</h1>

      @if (user; as currentUser) {
        <p>Bienvenido, {{ currentUser.firstName }}
          {{ currentUser.lastName }}</p>
        <p>Rol: {{ currentUser.rol }}</p>
        <p>Correo: {{ currentUser.email }}</p>
      }

      <button (click)="logout()">Cerrar sesión</button>
    </main>
  `,
})
export class PagePrincipal {

  private readonly authService = inject(LoginService);
  private readonly router = inject(Router);

  user = this.authService.getCurrentUser();

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
