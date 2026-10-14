import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; // 👈 Corregido: Router ya no viene de 'express'
import Swal from 'sweetalert2'; // 👈 Importamos SweetAlert2

import { LoginService } from '../../../service/login-service/login.service';

@Component({
  selector: 'app-login.component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  private readonly formBuilder = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  
  loading = false;

  errorMessage = ''; 

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.loginForm.invalid || this.loading) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.loginService.login(this.loginForm.getRawValue()).subscribe({
      next: (resp) => {
        Swal.fire({
          icon: 'success',
          title: 'Login exitoso',
          text: `Bienvenido ${resp.user.firstName || 'Usuario'}`, 
          timer: 1500,
          showConfirmButton: false
        });

        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const destination = returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
            ? returnUrl
            : '/dashboard'; 

        void this.router.navigateByUrl(destination);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: error.error?.message ?? 'Credenciales incorrectas. Inténtelo de nuevo.',
        });
        
        this.errorMessage = error.error?.message ?? 'No fue posible iniciar sesión.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}