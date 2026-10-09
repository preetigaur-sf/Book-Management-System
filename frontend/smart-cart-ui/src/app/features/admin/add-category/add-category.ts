import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  Category,
  CategoryService,
} from '../../categories/category.service';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-category.html',
  styleUrl: './add-category.scss',
})
export class AddCategory {

  private formbuilder = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  categoryForm = this.formbuilder.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
      ],
    ],
  });

  saveCategory(): void {

    if (this.categoryForm.invalid) {
      return;
    }

    const category: Category = {
      name: this.categoryForm.value.name!,
    };

    this.categoryService.addCategory(category).subscribe({

      next: () => {

        alert('Category Added Successfully');

        this.router.navigate(['/admin/categories']);

      },

      error: (err) => {

        console.error(err);

        alert('Failed to Add Category');

      },

    });

  }

}