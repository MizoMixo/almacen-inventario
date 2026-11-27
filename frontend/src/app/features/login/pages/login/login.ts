import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideWarehouse } from '@lucide/angular';
import { Auth } from '@core/auth/auth';
import { Sesion } from '@core/auth/sesion';

@Component({
  selector: 'app-login',
  imports: [FormsModule, LucideWarehouse],
  templateUrl: './login.html',
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);
  private sesion = inject(Sesion);

  usuario = '';
  clave = '';
  enviando = signal(false);
  error = signal('');

  constructor() {
    // Si ya hay sesión, no tiene sentido mostrar el login
    if (this.sesion.autenticado()) {
      this.router.navigate(['/inicio']);
    }
  }

  entrar() {
    if (!this.usuario.trim() || !this.clave) {
      this.error.set('Ingresa tu usuario y tu contraseña.');
      return;
    }
    this.error.set('');
    this.enviando.set(true);

    this.auth.login(this.usuario.trim(), this.clave).subscribe({
      next: () => this.router.navigate(['/inicio']),
      error: (e: HttpErrorResponse) => {
        this.enviando.set(false);
        if (e.status === 401) {
          this.error.set('Usuario o contraseña incorrectos.');
        } else if (e.status === 0) {
          this.error.set(
            'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.',
          );
        } else {
          this.error.set('Ocurrió un error inesperado. Intenta de nuevo.');
        }
      },
    });
  }
}
