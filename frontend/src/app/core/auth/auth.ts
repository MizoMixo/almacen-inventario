import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_URL } from '@core/config/api';
import { Sesion, UsuarioSesion } from '@core/auth/sesion';

interface LoginResponse {
  token: string;
  usuario: UsuarioSesion;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private http = inject(HttpClient);
  private sesion = inject(Sesion);

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${API_URL}/auth/login`, { username, password })
      .pipe(tap((r) => this.sesion.iniciar(r.token, r.usuario)));
  }

  // Datos reales del usuario dueño del token (también comprueba que el token siga siendo válido)
  perfil(): Observable<UsuarioSesion> {
    return this.http
      .get<UsuarioSesion>(`${API_URL}/auth/me`)
      .pipe(tap((u) => this.sesion.actualizarUsuario(u)));
  }
}
