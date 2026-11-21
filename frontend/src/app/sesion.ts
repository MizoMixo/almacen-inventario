import { Injectable } from '@angular/core';

// Usuario de la sesión. Por ahora es fijo; con autenticación real vendrá del login.
@Injectable({ providedIn: 'root' })
export class Sesion {
  nombre = 'Rony Castro';
  rol = 'Administrador';
}
