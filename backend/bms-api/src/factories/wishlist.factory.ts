import {Wishlist} from '../models';

export class WishlistFactory {
  static createWishlist(
    userId: number,
    productId: number,
  ): Partial<Wishlist> {
    return {
      user_id: userId,
      product_id: productId,
    };
  }
}