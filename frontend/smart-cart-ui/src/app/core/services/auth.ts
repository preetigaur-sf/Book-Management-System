import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Api } from './api';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { RegisterRequest } from '../models/register-request';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private api = inject(Api);

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.api.post<LoginResponse>(
      'login',
      loginRequest,
    );
  }

  register(registerRequest: RegisterRequest) {
    return this.api.post(
      'register',
      registerRequest,
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  saveRefreshToken(refreshToken:string):void{
    localStorage.setItem('refreshToken', refreshToken);
  }

  refreshToken():Observable<LoginResponse>{
    const refreshToken = localStorage.getItem('refreshToken');
    return this.api.post<LoginResponse>(
      'token-refresh',
      {refreshToken},
    )  ;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUserId(): number | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Number(payload.id);
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  }

  logout(): Observable<{success: boolean}> {
  const refreshToken = localStorage.getItem('refreshToken');

  console.log("Logout successfully");
  return this.api.post<{success: boolean}>(
    'logout',
    {refreshToken},
  );
}

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

}