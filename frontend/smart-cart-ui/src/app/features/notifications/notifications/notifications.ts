import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, Observable } from 'rxjs';
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

  notifications$: Observable<Notification[]> = new Observable();
  
  
  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
        this.notifications$ = this.notificationService.getMyNotifications().pipe(map(notifications=> notifications.sort((a,b)=> new Date(b.created_at!).getTime()-new Date(a.created_at!).getTime())
      )
    );

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