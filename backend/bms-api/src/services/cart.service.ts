import {injectable, BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';

import {AddToCartRequest} from '../models/add-to-cart-request.model';
import {UpdateCartRequest} from '../models/update-cart-request.model';

import {CartRepository} from '../repositories/cart.repository';
import {ProductRepository} from '../repositories/product.repository';

@injectable({scope: BindingScope.TRANSIENT})
export class CartService {
  constructor(
    @repository(CartRepository)
    public cartRepository: CartRepository,

    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) {}

  async addToCart(userId: number, cartData: AddToCartRequest): Promise<object> {
    const product = await this.productRepository.findById(cartData.product_id);

    if (product.stock_quantity < cartData.quantity) {
      throw new Error('Requested quantity is not available in stock.');
    }

    const existingCart = await this.cartRepository.findOne({
      where: {
        user_id: userId,
        product_id: cartData.product_id,
      },
    });

    if (existingCart) {
      await this.cartRepository.updateById(existingCart.id, {
        quantity: existingCart.quantity + cartData.quantity,
      });

      return {
        message: 'Cart updated successfully.',
      };
    }

    await this.cartRepository.create({
      user_id: userId,
      product_id: cartData.product_id,
      quantity: cartData.quantity,
    });

    return {
      message: 'Product added to cart successfully.',
    };
  }

  async getCart(userId: number) {
    return this.cartRepository.find({
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
  async updateCartQuantity(
    userId: number,
    cartId: number,
    cartData: UpdateCartRequest,
  ): Promise<object> {
    const cart = await this.cartRepository.findById(cartId);

    if (cart.user_id !== userId) {
      throw new Error('You are not authorized to update this cart.');
    }

    const product = await this.productRepository.findById(cart.product_id);

    if (cartData.quantity > product.stock_quantity) {
      throw new Error('Requested quantity is not available in stock.');
    }

    await this.cartRepository.updateById(cartId, {
      quantity: cartData.quantity,
    });

    return {
      message: 'Cart quantity updated successfully.',
    };
  }

  async removeFromCart(userId: number, cartId: number): Promise<object> {
    const cart = await this.cartRepository.findById(cartId);

    if (cart.user_id !== userId) {
      throw new Error('You are not authorized to remove this cart item.');
    }

    await this.cartRepository.deleteById(cartId);

    return {
      message: 'Product removed from cart successfully.',
    };
  }
}
