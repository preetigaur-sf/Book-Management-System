import { Injectable, inject } from '@angular/core';
import { Api } from '../../core/services/api';
import { User } from '../../core/models/user';
import { Observable,  } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private api = inject(Api);


  getUsers(): Observable<User[]> {
    return this.api.get<User[]>('users');
  }

  getUserById(id: number): Observable<User> {
    return this.api.get<User>(`users/${id}`);
  }

  updateUser(id: number, user: User): Observable<void> {
    return this.api.patch<void>(`users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.api.delete<void>(`users/${id}`);
  }

}