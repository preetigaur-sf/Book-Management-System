import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Api } from './api';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private api = inject(Api);

  getMyNotifications(): Observable<Notification[]> {
    return this.api.get<Notification[]>('notifications/my');
  }

  markAsRead(id: number): Observable<void> {
    return this.api.patch<void>(`notifications/${id}/read`, {});
  }
}