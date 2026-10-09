import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { UserService } from '../../user/user';
import { User } from '../../../core/models/user';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.scss',
})
export class EditUser implements OnInit {

  private formBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  userId!: number;

  userForm = this.formBuilder.group({
    first_name: ['', Validators.required],
    last_name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    role_id: [2, Validators.required],
  });

  ngOnInit(): void {
    this.userId = Number(
      this.route.snapshot.paramMap.get('id'),
    );

    this.loadUser();
  }

  loadUser(): void {

    this.userService
      .getUserById(this.userId)
      .subscribe({

        next: (user: User) => {

          this.userForm.patchValue({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
            role_id: user.role_id,
          });

        },

        error: (err) => {

          console.error(err);

          alert('Failed to load user');

        },

      });

  }

  updateUser(): void {

    if (this.userForm.invalid) {
      return;
    }

    const formValue = this.userForm.getRawValue();

    const user: User = {
      id: this.userId,
      first_name: formValue.first_name!,
      last_name: formValue.last_name ?? '',
      email: formValue.email!,
      password: formValue.password ?? '',
      role_id: Number(formValue.role_id),
    };

    this.userService
      .updateUser(this.userId, user)
      .subscribe({

        next: () => {

          alert('User Updated Successfully');

          this.router.navigate(['/admin/users']);

        },

        error: (err) => {

          console.error(err);

          alert('Failed to update user');

        },

      });

  }

  cancel(): void {
    this.router.navigate(['/admin/users']);
  }

}