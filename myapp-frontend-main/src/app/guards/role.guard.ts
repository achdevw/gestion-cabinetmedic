import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './../services/auth.service';

export function roleGuard(expectedRoles: string[]): CanActivateFn {
  return (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const userRole = auth.getUserRole();

    if (userRole && expectedRoles.includes(userRole)) {
      return true;
    } else {
      router.navigate(['/unauthorized']);
      return false;
    }
  };
}
