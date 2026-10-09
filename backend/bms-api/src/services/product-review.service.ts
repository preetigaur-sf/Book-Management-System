import {injectable} from '@loopback/core';
import {repository} from '@loopback/repository';

import {ProductRepository, ProductReviewRepository} from '../repositories';
import {ProductReviewFactory} from '../factories/product-review.factory';

@injectable()
export class ProductReviewService {
  constructor(
    @repository(ProductReviewRepository)
    public productReviewRepository: ProductReviewRepository,

    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) {}

  async addReview(
    userId: number,
    productId: number,
    rating: number,
    comment?: string,
  ): Promise<object> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    const existingReview = await this.productReviewRepository.findOne({
      where: {
        user_id: userId,
        product_id: productId,
      },
    });

    if (existingReview) {
      throw new Error('You have already reviewed this product');
    }

    const review = ProductReviewFactory.createReview(
      userId,
      productId,
      rating,
      comment,
    );

    await this.productReviewRepository.create(review);

    return {
      message: 'Review added successfully',
    };
  }
  async getAllReviews() {
    return this.productReviewRepository.find({
      include: [
        {
          relation: 'user',
        },
        {
          relation: 'product',
        },
      ],
    });
  }
  async getReviewById(reviewId: number) {
    return this.productReviewRepository.findById(reviewId, {
      include: [
        {
          relation: 'user',
        },
        {
          relation: 'product',
        },
      ],
    });
  }

  async getProductReviews(productId: number) {
    return this.productReviewRepository.find({
      where: {
        product_id: productId,
      },
      include: [
        {
          relation: 'user',
        },
      ],
    });
  }
  async updateReview(
    reviewId: number,
    rating: number,
    comment?: string,
  ): Promise<object> {
    const review = await this.productReviewRepository.findById(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }
    await this.productReviewRepository.updateById(reviewId, {
      rating,
      comment,
    });

    return {
      message: 'Review updated successfully',
    };
  }
  async deleteReviewByAdmin(reviewId: number): Promise<object> {
    const review = await this.productReviewRepository.findById(reviewId);

    if (!review) {
      throw new Error('Review not found');
    }

    await this.productReviewRepository.deleteById(reviewId);

    return {
      message: 'Review deleted successfully',
    };
  }
  async deleteReview(userId: number, reviewId: number): Promise<object> {
    const review = await this.productReviewRepository.findById(reviewId);

    if (review.user_id !== userId) {
      throw new Error('You are not authorized to delete this review');
    }

    await this.productReviewRepository.deleteById(reviewId);

    return {
      message: 'Review deleted successfully',
    };
  }
}
