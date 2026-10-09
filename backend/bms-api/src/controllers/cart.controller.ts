import {inject, service} from '@loopback/core';

import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {authorize} from 'loopback4-authorization';
import {Permissions} from '../authorization/permissions';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';

import {authenticate, STRATEGY} from 'loopback4-authentication';
import {AuthenticationBindings} from 'loopback4-authentication';
import {UserProfile} from '@loopback/security';

import {Cart} from '../models/cart.model';
import {AddToCartRequest} from '../models/add-to-cart-request.model';
import {UpdateCartRequest} from '../models/update-cart-request.model';
import {CartRepository} from '../repositories';
import {CartService} from '../services';

export class CartController {
  constructor(
    @repository(CartRepository)
    public cartRepository: CartRepository,

    @service(CartService)
    public cartService: CartService,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.CreateCart],
  })
  @post('/cart/add')
  @response(200, {
    description: 'Add product to cart',
  })
  async addToCart(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,

    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AddToCartRequest),
        },
      },
    })
    cartData: AddToCartRequest,
  ): Promise<object> {
    const userId = Number(currentUser.id);

    return this.cartService.addToCart(userId, cartData);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadCart],
  })
  @get('/cart')
  @response(200, {
    description: 'Get logged in user cart',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Cart, {
            includeRelations: true,
          }),
        },
      },
    },
  })
  async getCart(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<Cart[]> {
    const userId = Number(currentUser.id);

    return this.cartService.getCart(userId);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateCart],
  })
  @patch('/cart/update/{cartId}')
  @response(200, {
    description: 'Update cart quantity',
  })
  async updateCartQuantity(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,

    @param.path.number('cartId')
    cartId: number,

    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UpdateCartRequest),
        },
      },
    })
    cartData: UpdateCartRequest,
  ): Promise<object> {
    const userId = Number(currentUser.id);

    return this.cartService.updateCartQuantity(userId, cartId, cartData);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.DeleteCart],
  })
  @del('/cart/remove/{cartId}')
  @response(200, {
    description: 'Remove product from cart',
  })
  async removeFromCart(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,

    @param.path.number('cartId')
    cartId: number,
  ): Promise<object> {
    const userId = Number(currentUser.id);

    return this.cartService.removeFromCart(userId, cartId);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.CreateCart],
  })
  @post('/carts')
  @response(200, {
    description: 'Cart model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cart),
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cart, {
            title: 'NewCart',
            exclude: ['id'],
          }),
        },
      },
    })
    cart: Omit<Cart, 'id'>,
  ): Promise<Cart> {
    return this.cartRepository.create(cart);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadCart],
  })
  @get('/carts/count')
  @response(200, {
    description: 'Cart model count',
    content: {
      'application/json': {
        schema: CountSchema,
      },
    },
  })
  async count(@param.where(Cart) where?: Where<Cart>): Promise<Count> {
    return this.cartRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadCart],
  })
  @get('/carts')
  @response(200, {
    description: 'Array of Cart model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Cart, {
            includeRelations: true,
          }),
        },
      },
    },
  })
  async find(@param.filter(Cart) filter?: Filter<Cart>): Promise<Cart[]> {
    return this.cartRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateCart],
  })
  @patch('/carts')
  @response(200, {
    description: 'Cart PATCH success count',
    content: {
      'application/json': {
        schema: CountSchema,
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cart, {
            partial: true,
          }),
        },
      },
    })
    cart: Cart,
    @param.where(Cart) where?: Where<Cart>,
  ): Promise<Count> {
    return this.cartRepository.updateAll(cart, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadCart],
  })
  @get('/carts/{id}')
  @response(200, {
    description: 'Cart model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Cart, {
          includeRelations: true,
        }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Cart, {exclude: 'where'})
    filter?: FilterExcludingWhere<Cart>,
  ): Promise<Cart> {
    return this.cartRepository.findById(id, filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateCart],
  })
  @patch('/carts/{id}')
  @response(204, {
    description: 'Cart PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cart, {
            partial: true,
          }),
        },
      },
    })
    cart: Cart,
  ): Promise<void> {
    await this.cartRepository.updateById(id, cart);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateCart],
  })
  @put('/carts/{id}')
  @response(204, {
    description: 'Cart PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() cart: Cart,
  ): Promise<void> {
    await this.cartRepository.replaceById(id, cart);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.DeleteCart],
  })
  @del('/carts/{id}')
  @response(204, {
    description: 'Cart DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.cartRepository.deleteById(id);
  }
}
