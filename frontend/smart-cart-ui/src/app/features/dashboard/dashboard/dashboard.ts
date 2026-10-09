import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  private auth = inject(Auth);
  private router = inject(Router);

  logout(): void {

    this.auth.logout();

    this.router.navigate(['/login']);

  }

}