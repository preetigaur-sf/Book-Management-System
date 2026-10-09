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

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.clear();
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

}