import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();

  if (token) {
    // Vérifie si le token est expiré
    if (auth.isTokenExpired()) {
      auth.logout(); // Efface le token
      router.navigate(['/login']); // Redirection
      return next(req); // Continue pour éviter blocage mais sans token
    }

    // Sinon, ajoute l'en-tête Authorization
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
};
