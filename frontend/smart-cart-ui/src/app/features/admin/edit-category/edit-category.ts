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

import { CategoryService } from '../../categories/category.service';
import { Category } from '../../../core/models/category';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-category.html',
  styleUrl: './edit-category.scss',
})
export class EditCategory implements OnInit {

  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categoryId!: number;

  categoryForm = this.fb.group({
    name: ['', Validators.required],
  });

  ngOnInit(): void {
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCategory();
  }

  loadCategory(): void {
    this.categoryService.getCategoryById(this.categoryId).subscribe({

      next: (category: Category) => {
        this.categoryForm.patchValue(category);
      },

      error: (err) => {
        console.error(err);
        alert('Failed to load category');
      },

    });
  }

  updateCategory(): void {

    if (this.categoryForm.invalid) {
      return;
    }

    this.categoryService.updateCategory(
      this.categoryId,
      this.categoryForm.value as Category
    ).subscribe({

      next: () => {
        alert('Category Updated Successfully');
        this.router.navigate(['/admin/categories']);
      },

      error: (err) => {
        console.error(err);
        alert('Failed to update category');
      },

    });

  }

}