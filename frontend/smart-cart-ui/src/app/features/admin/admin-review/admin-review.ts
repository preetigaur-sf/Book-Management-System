import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ReviewService } from '../../product-review/review';
import { ProductReview } from '../../../core/models/product-review';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-review.html',
  styleUrl: './admin-review.scss',
})
export class AdminReviews implements OnInit {
  private reviewService = inject(ReviewService);

  private cdr = inject(ChangeDetectorRef);

  reviews: ProductReview[] = [];

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getReviews().subscribe({
      next: (response) => {
        console.log('Reviews:', response);

        this.reviews = [...response];

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  deleteReview(id: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this review?');

    if (!confirmDelete) {
      return;
    }

    this.reviewService.deleteReview(id).subscribe({
      next: () => {
        alert('Review Deleted Successfully');
        this.loadReviews();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to delete review');
      },
    });
  }
}
