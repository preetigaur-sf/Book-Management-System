import {authenticate, STRATEGY} from 'loopback4-authentication';
import {inject} from '@loopback/core';
import {del, get, param, post, requestBody} from '@loopback/rest';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserProfile} from '@loopback/security';
import {authorize} from 'loopback4-authorization';
import {Permissions} from '../authorization/permissions';
import {WishlistService} from '../services';

export class WishlistController {
  constructor(
    @inject('services.WishlistService')
    public wishlistService: WishlistService,
  ) {}
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.CreateWishlist],
  })
  @post('/wishlist')
  async addToWishlist(
    @inject(AuthenticationBindings.CURRENT_USER)
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
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadWishlist],
  })
  @get('/wishlist')
  async getMyWishlist(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUserProfile: UserProfile,
  ) {
    console.log('Get user Id:', currentUserProfile.id);
    return this.wishlistService.getMyWishlist(Number(currentUserProfile.id));
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.DeleteWishlist],
  })
  @del('/wishlist/{wishlistId}')
  async removeWishlist(
    @inject(AuthenticationBindings.CURRENT_USER)
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
