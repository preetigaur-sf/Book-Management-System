import {
  Count,
  CountSchema,
  repository,
  Where,
} from '@loopback/repository';
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
import {Order, PlaceOrderRequest} from '../models';
import {OrderRepository} from '../repositories';
import {inject, service} from '@loopback/core';
import {OrderService} from '../services';
import {CheckoutFacade} from '../facades';

import {UserProfile} from '@loopback/security';
import { AuthenticationBindings } from 'loopback4-authentication';
import {UpdateOrderStatusRequest} from '../models';
import {authorize} from 'loopback4-authorization';
import {Permissions} from '../authorization/permissions';
import {authenticate, STRATEGY} from 'loopback4-authentication';

export class OrderController {
  constructor(
    @repository(OrderRepository)
    public orderRepository: OrderRepository,
    @service(OrderService)
    public orderService: OrderService,
    @inject('facades.CheckoutFacade')
    public checkoutFacade: CheckoutFacade,
  ) {}
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.CreateOrder],
  })
  @post('/orders')
  @response(200, {
    description: 'Order model instance',
    content: {'application/json': {schema: getModelSchemaRef(Order)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {
            title: 'NewOrder',
            exclude: ['id'],
          }),
        },
      },
    })
    order: Omit<Order, 'id'>,
  ): Promise<Order> {
    return this.orderRepository.create(order);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadOrder],
  })
  @get('/orders/count')
  @response(200, {
    description: 'Order model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Order) where?: Where<Order>): Promise<Count> {
    return this.orderRepository.count(where);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateOrder],
  })
  @patch('/orders')
  @response(200, {
    description: 'Order PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {partial: true}),
        },
      },
    })
    order: Order,
    @param.where(Order) where?: Where<Order>,
  ): Promise<Count> {
    return this.orderRepository.updateAll(order, where);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateOrder],
  })
  @patch('/orders/{id}')
  @response(204, {
    description: 'Order PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {partial: true}),
        },
      },
    })
    order: Order,
  ): Promise<void> {
    await this.orderRepository.updateById(id, order);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateOrder],
  })
  @put('/orders/{id}')
  @response(204, {
    description: 'Order PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() order: Order,
  ): Promise<void> {
    await this.orderRepository.replaceById(id, order);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.CreateOrder],
  })
  @post('/orders/place-order')
  @response(200, {
    description: 'placed order',
  })
  async placeOrder(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,

    @requestBody()
    orderData: PlaceOrderRequest,
  ) {
    const userId = Number(currentUser.id);
    return this.checkoutFacade.placeOrder(userId, orderData);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadOrder],
  })
  @get('/orders/my-orders')
  @response(200, {
    description: 'my orders',
  })
  async getMyOrders(
  @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ) {
    const userId = Number(currentUser.id);
    return this.orderService.getMyOrders(userId);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadOrder],
  })
  @get('/orders/{orderId}')
  @response(200, {
    description: 'Get order by id',
  })
  async getOrderById(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.path.number('orderId') orderId: number,
  ) {
    const userId = Number(currentUser.id);
    return this.orderService.getOrderById(userId, orderId);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateOrder],
  })
  @patch('/orders/cancel/{orderId}')
  @response(200, {
    description: 'cancel order',
  })
  async cancelOrder(
   @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
    @param.path.number('orderId') orderId: number,
  ) {
    const userId = Number(currentUser.id);
    return this.orderService.cancelOrder(userId, orderId);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateOrder],
  })
  @patch('/orders/{id}/status')
  async updateOrderStatus(
    @param.path.number('id') id: number,

    @requestBody()
    body: UpdateOrderStatusRequest,
  ) {
    return this.orderService.updateOrderStatus(id, body.order_status);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadOrder],
  })
  @get('/orders')
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadOrder],
  })
  @get('/orders/admin/{id}')
  async getOrderByIdForAdmin(@param.path.number('id') id: number) {
    return this.orderService.getOrderByIdForAdmin(id);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.DeleteOrder],
  })
  @del('/orders/{id}')
  async deleteOrder(@param.path.number('id') id: number) {
    return this.orderService.deleteOrder(id);
  }
}
