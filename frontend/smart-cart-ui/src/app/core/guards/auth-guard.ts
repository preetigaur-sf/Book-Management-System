import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';

import {Auth} from '../services/auth';

export const authGuard: CanActivateFn = () => {
  console.log('guard executed');
  const auth = inject(Auth);
  const router = inject(Router);

  console.log('Token:', auth.getToken());
  if (auth.isLoggedIn()) {
    console.log("Allowed");
    return true;
  }

  console.log("redirect to login");
  router.navigate(['/login']);
  return false;
};