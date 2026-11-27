import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '@core/config/api';
import { Sesion } from '@core/auth/sesion';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const sesion = inject(Sesion);
  const router = inject(Router);

  const esApi = req.url.startsWith(API_URL);
  const token = sesion.token();
  const peticion =
    esApi && token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 fuera del login = sesión vencida
      if (error.status === 401 && esApi && !req.url.endsWith('/auth/login')) {
        sesion.cerrar();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
