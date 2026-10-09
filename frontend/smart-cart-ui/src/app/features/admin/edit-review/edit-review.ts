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

import { ReviewService } from '../../product-review/review';

@Component({
  selector: 'app-edit-review',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-review.html',
  styleUrl: './edit-review.scss',
})
export class EditReview implements OnInit {

  private formBuilder = inject(FormBuilder);
  private reviewService = inject(ReviewService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  reviewId!: number;

  reviewForm = this.formBuilder.group({
    rating: [
      5,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(5),
      ],
    ],
    comment: [
      '',
      Validators.required,
    ],
  });

  ngOnInit(): void {
    this.reviewId = Number(
      this.route.snapshot.paramMap.get('id'),
    );

    this.loadReview();
  }

  loadReview(): void {
    this.reviewService.getReviewById(this.reviewId).subscribe({
      next: (review) => {
        this.reviewForm.patchValue({
          rating: review.rating,
          comment: review.comment ?? '',
        });
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load review');
      },
    });
  }

  updateReview(): void {

    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const review = {
      rating: Number(this.reviewForm.value.rating),
      comment: this.reviewForm.value.comment??"",
    };

    this.reviewService
      .updateReview(this.reviewId, review)
      .subscribe({
        next: () => {
          alert('Review Updated Successfully');
          this.router.navigate(['/admin/reviews']);
        },
        error: (err) => {
          console.error(err);
          alert('Failed to update review');
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/admin/reviews']);
  }

}