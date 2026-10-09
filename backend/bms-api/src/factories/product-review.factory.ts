import {ProductReview} from '../models';

export class ProductReviewFactory {
  static createReview(
    userId: number,
    productId: number,
    rating: number,
    comment?: string,
  ): Partial<ProductReview> {
    return {
      user_id: userId,
      product_id: productId,
      rating: rating,
      comment: comment,
    };
  }
}