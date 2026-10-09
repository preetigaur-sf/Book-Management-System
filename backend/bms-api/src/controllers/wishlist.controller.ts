import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {del, get, param, post, requestBody} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';

import {WishlistService} from '../services';

@authenticate('jwt')
export class WishlistController {
  constructor(
    @inject('services.WishlistService')
    public wishlistService: WishlistService,
  ) {}

  @post('/wishlist')
  async addToWishlist(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,

    @requestBody({
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['product_id'],
            properties: {
              product_id: {
                type: 'number',
              },
            },
          },
        },
      },
    })
    body: {
      product_id: number;
    },
  ) {
    console.log('Post User ID:', currentUserProfile.id);
    return this.wishlistService.addToWishlist(
      Number(currentUserProfile.id),
      body.product_id,
    );
  }

  @get('/wishlist')
  async getMyWishlist(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ) {
    console.log('Get user Id:',currentUserProfile.id);
    return this.wishlistService.getMyWishlist(
      Number(currentUserProfile.id),
    );
  }

  @del('/wishlist/{wishlistId}')
  async removeWishlist(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,

    @param.path.number('wishlistId')
    wishlistId: number,
  ) {
    return this.wishlistService.removeWishlist(
      Number(currentUserProfile.id),
      wishlistId,
    );
  }
}
