import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from '../../user/user';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.scss',
})
export class AdminUsers implements OnInit {
  private userService = inject(UserService);
  private cdx = inject(ChangeDetectorRef);
  users: any[] = [];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        this.users = response;
        this.cdx.detectChanges();
        console.log('Users:', this.users);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  deleteUser(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this user?');

    if (!confirmed) {
      return;
    }

    this.userService.deleteUser(id).subscribe({
      next: () => {
        alert('User Deleted Successfully');

        this.loadUsers();
      },

      error: (err) => {
        console.error(err);
        alert('Failed to Delete User');
      },
    });
  }
}
