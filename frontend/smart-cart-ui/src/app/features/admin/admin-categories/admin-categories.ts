import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  Category,
  CategoryService,
} from '../../categories/category.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.scss',
})
export class AdminCategories implements OnInit {

  private categoryService = inject(CategoryService);

  private cdr = inject(ChangeDetectorRef);

  categories: Category[] = [];

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {

    this.categoryService.getCategories().subscribe({

      next: (response) => {

        console.log('Categories:', response);

        this.categories = [...response];

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error(err);

      },

    });

  }

  deleteCategory(id: number): void {

    if (!confirm('Delete this category?')) {
      return;
    }

    this.categoryService.deleteCategory(id).subscribe({

      next: () => {

        alert('Category deleted successfully');

        this.loadCategories();

      },

      error: (err) => {

        console.error(err);

        alert('Failed to delete category');

      },

    });

  }

}