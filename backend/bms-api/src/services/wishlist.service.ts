import {injectable} from '@loopback/core';
import {repository} from '@loopback/repository';

import {WishlistRepository, ProductRepository} from '../repositories';
import {WishlistFactory} from '../factories/wishlist.factory';

@injectable()
export class WishlistService {
  constructor(
    @repository(WishlistRepository)
    public wishlistRepository: WishlistRepository,

    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) {}

  async addToWishlist(userId: number, productId: number): Promise<object> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    const existingWishlist = await this.wishlistRepository.findOne({
      where: {
        user_id: userId,
        product_id: productId,
      },
    });

    if (existingWishlist) {
      throw new Error('Product already exists in wishlist');
    }

    const wishlist = WishlistFactory.createWishlist(userId, productId);

    await this.wishlistRepository.create(wishlist);

    return {
      message: 'Product added to wishlist successfully',
    };
  }

  async getMyWishlist(userId: number) {
    return this.wishlistRepository.find({
      where: {
        user_id: userId,
      },
      include: [
        {
          relation: 'product',
        },
      ],
    });
  }

  async removeWishlist(userId: number, wishlistId: number): Promise<object> {
    const wishlist = await this.wishlistRepository.findById(wishlistId);

    if (wishlist.user_id !== userId) {
      throw new Error('You are not authorized');
    }

    await this.wishlistRepository.deleteById(wishlistId);

    return {
      message: 'Wishlist item removed successfully',
    };
  }
}
