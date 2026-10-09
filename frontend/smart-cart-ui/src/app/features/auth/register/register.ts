import {Component, inject} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Auth} from '../../../core/services/auth';
import {RegisterRequest} from '../../../core/models/register-request';
import { Router,RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  registerForm: FormGroup;

  private auth = inject(Auth);
   private router = inject(Router);
  isSubmitting = false;
  errorMessage = '';

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      first_name: [
        '',
        [Validators.required],
      ],
      last_name: [
        '',
        [Validators.required],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
        ],
      ],
      confirmPassword: [
        '',
        [
          Validators.required,
        ],
      ],
    });
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    if (
      this.registerForm.value.password !==
      this.registerForm.value.confirmPassword
    ) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const registerRequest: RegisterRequest = {
      first_name: this.registerForm.value.first_name,
      last_name: this.registerForm.value.last_name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };

    this.auth.register(registerRequest).subscribe({
      next: response => {
        this.isSubmitting = false;

        console.log('Registration Successful');

        this.router.navigate(['/login']);
        console.log(response);
        
      },

      error: error => {
        this.isSubmitting = false;

        this.errorMessage =
          error.error?.message ?? 'Registration Failed';

        console.error(error);
      },
    });
  }
}