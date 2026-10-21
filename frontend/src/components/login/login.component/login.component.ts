import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { LoginService } from '../../../service/login-service/login.service';

@Component({
  selector: 'app-login.component',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {

  private readonly formBuilder = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // La app corre sin zone.js: el estado que cambia en callbacks async debe ser un signal
  loading = signal(false);
  errorMessage = signal('');

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.loginForm.invalid || this.loading()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.loginService.login(this.loginForm.getRawValue()).subscribe({
      next: (resp) => {
        void Swal.fire({
          icon: 'success',
          title: 'Login exitoso',
          text: `Bienvenido ${resp.user.firstName || 'Usuario'}`,
          timer: 1500,
          showConfirmButton: false,
        });

        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const destination = returnUrl?.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/drive';

        void this.router.navigateByUrl(destination);
      },
      error: (error) => {
        const mensaje = error.error?.message ?? 'Credenciales incorrectas. Inténtelo de nuevo.';
        void Swal.fire({ icon: 'error', title: 'Error de autenticación', text: mensaje });
        this.errorMessage.set(mensaje);
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }
}
