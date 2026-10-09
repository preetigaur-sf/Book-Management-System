import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../../core/services/auth';
import { LoginRequest } from '../../../core/models/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm: FormGroup;

  private auth = inject(Auth);
  private router = inject(Router);

  isSubmitting = false;
  errorMessage = '';

  constructor(private formbuilder: FormBuilder) {
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const loginRequest: LoginRequest = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.auth.login(loginRequest).subscribe({
      next: (response) => {
        console.log(response);
        this.auth.saveToken(response.token);

        this.isSubmitting = false;

        console.log('Login Successful');
        this.router.navigate(['/dashboard']).then((result) => {
          console.log('Navigation:', result);
          console.log('Current URL:', this.router.url);
        });
      },

      error: (error) => {
        this.isSubmitting = false;

        this.errorMessage = error.error?.message ?? 'Invalid email or password';

        console.error(error);
      },
    });
  }
}
