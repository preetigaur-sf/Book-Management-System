import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Api } from '../../core/services/api';
import { ProductReview } from '../../core/models/product-review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private api = inject(Api);

  constructor() {}

  getReviews(): Observable<ProductReview[]> {
    return this.api.get<ProductReview[]>('reviews');
  }

  getReviewById(id: number): Observable<ProductReview> {
    return this.api.get<ProductReview>(`reviews/${id}`);
  }

  updateReview(
    id: number,
    review: {
      rating: number;
      comment: string;
    },
  ): Observable<object> {
    return this.api.patch<object>(`reviews/${id}`, review);
  }

  deleteReview(id: number): Observable<object> {
    return this.api.delete<object>(`reviews/admin/${id}`);
  }
}
