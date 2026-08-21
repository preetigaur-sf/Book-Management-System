import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/services/auth';
@Component({
  selector: 'app-admin-sidebar',
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.scss',
})
export class AdminSidebar {
  private auth = inject(Auth);
  private router = inject(Router);

  logout():void{
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
