import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Notification } from '../../../core/models/notification.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications implements OnInit {

  private notificationService = inject(NotificationService);

  notifications: Notification[] = [];

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getMyNotifications().subscribe({
      next: (data) => {
        this.notifications = data.sort((a,b)=> new Date(b.created_at).getTime()- new Date(a.created_at).getTime());
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  markAsRead(id: number): void {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        this.loadNotifications();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}