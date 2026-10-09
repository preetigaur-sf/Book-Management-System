import {authenticate, STRATEGY} from 'loopback4-authentication';
import {inject} from '@loopback/core';
import {
  del,
  get,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';

import {ProductReviewService} from '../services/product-review.service';
import {authorize} from 'loopback4-authorization';
import {Permissions} from '../authorization/permissions';

export class ProductReviewController {
  constructor(
    @inject('services.ProductReviewService')
    public productReviewService: ProductReviewService,
  ) {}
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.CreateProductReview],
  })
  @post('/products/{productId}/reviews')
  @response(200, {
    description: 'Add Product Review',
  })
  async addReview(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,

    @param.path.number('productId')
    productId: number,

    @requestBody({
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['rating'],
            properties: {
              rating: {
                type: 'number',
                minimum: 1,
                maximum: 5,
              },
              comment: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    body: {
      rating: number;
      comment?: string;
    },
  ) {
    return this.productReviewService.addReview(
      Number(currentUserProfile.id),
      productId,
      body.rating,
      body.comment,
    );
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadProductReview],
  })
  @get('/products/{productId}/reviews')
  @response(200, {
    description: 'Get Product Reviews',
  })
  async getProductReviews(
    @param.path.number('productId')
    productId: number,
  ) {
    return this.productReviewService.getProductReviews(productId);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.DeleteProductReview],
  })
  @del('/reviews/{reviewId}')
  @response(200, {
    description: 'Delete Own Review',
  })
  async deleteReview(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,

    @param.path.number('reviewId')
    reviewId: number,
  ) {
    return this.productReviewService.deleteReview(
      Number(currentUserProfile.id),
      reviewId,
    );
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadProductReview],
  })
  @get('/reviews')
  @response(200, {
    description: 'Get All Reviews',
  })
  async getAllReviews() {
    return this.productReviewService.getAllReviews();
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadProductReview],
  })
  @get('/reviews/{id}')
  @response(200, {
    description: 'Get Review By Id',
  })
  async getReviewById(
    @param.path.number('id')
    id: number,
  ) {
    return this.productReviewService.getReviewById(id);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateProductReview],
  })
  @patch('/reviews/{id}')
  @response(200, {
    description: 'Update Review',
  })
  async updateReview(
    @param.path.number('id')
    id: number,

    @requestBody({
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['rating'],
            properties: {
              rating: {
                type: 'number',
                minimum: 1,
                maximum: 5,
              },
              comment: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    body: {
      rating: number;
      comment?: string;
    },
  ) {
    return this.productReviewService.updateReview(
      id,
      body.rating,
      body.comment,
    );
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.DeleteProductReview],
  })
  @del('/reviews/admin/{id}')
  @response(200, {
    description: 'Delete Review By Admin',
  })
  async deleteReviewByAdmin(
    @param.path.number('id')
    id: number,
  ) {
    return this.productReviewService.deleteReviewByAdmin(id);
  }
}
