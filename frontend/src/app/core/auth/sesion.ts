import { computed, Injectable, signal } from '@angular/core';

export type Rol = 'ADMINISTRADOR' | 'ALMACENERO';

export interface UsuarioSesion {
  id: number;
  username: string;
  nombreCompleto: string;
  rol: Rol;
}

const CLAVE_TOKEN = 'almacen.token';
const CLAVE_USUARIO = 'almacen.usuario';

// Estado de la sesión: token + usuario. Se guarda en el navegador para sobrevivir a recargas.
@Injectable({ providedIn: 'root' })
export class Sesion {
  private _token = signal<string | null>(this.leerToken());
  private _usuario = signal<UsuarioSesion | null>(this.leerUsuario());

  readonly token = this._token.asReadonly();
  readonly usuario = this._usuario.asReadonly();

  readonly autenticado = computed(() => !!this._token() && !!this._usuario());
  readonly nombre = computed(() => this._usuario()?.nombreCompleto ?? '');
  readonly rolTexto = computed(() =>
    this._usuario()?.rol === 'ADMINISTRADOR' ? 'Administrador' : 'Almacenero',
  );
  readonly esAdministrador = computed(() => this._usuario()?.rol === 'ADMINISTRADOR');

  iniciar(token: string, usuario: UsuarioSesion) {
    localStorage.setItem(CLAVE_TOKEN, token);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    this._token.set(token);
    this._usuario.set(usuario);
  }

  actualizarUsuario(usuario: UsuarioSesion) {
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    this._usuario.set(usuario);
  }

  cerrar() {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    this._token.set(null);
    this._usuario.set(null);
  }

  private leerToken(): string | null {
    try {
      return localStorage.getItem(CLAVE_TOKEN);
    } catch {
      return null;
    }
  }

  private leerUsuario(): UsuarioSesion | null {
    try {
      const texto = localStorage.getItem(CLAVE_USUARIO);
      return texto ? (JSON.parse(texto) as UsuarioSesion) : null;
    } catch {
      return null;
    }
  }
}
