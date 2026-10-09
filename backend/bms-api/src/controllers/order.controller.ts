import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
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
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {UpdateOrderStatusRequest} from '../models';
import {authorize} from '@loopback/authorization';
import {Roles} from '../authorization/roles';
@authenticate('jwt')
export class OrderController {
  constructor(
    @repository(OrderRepository)
    public orderRepository: OrderRepository,
    @service(OrderService)
    public orderService: OrderService,
    @inject('facades.CheckoutFacade')
    public checkoutFacade: CheckoutFacade,
  ) {}
  @authorize({
    allowedRoles: [Roles.ADMIN],
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
  @authorize({
    allowedRoles: [Roles.ADMIN],
  })
  @get('/orders/count')
  @response(200, {
    description: 'Order model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Order) where?: Where<Order>): Promise<Count> {
    return this.orderRepository.count(where);
  }
  @authorize({
    allowedRoles: [Roles.ADMIN],
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
  @authorize({
    allowedRoles: [Roles.ADMIN],
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
  @authorize({
    allowedRoles: [Roles.ADMIN],
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

  @authenticate('jwt')
  @post('/orders/place-order')
  @response(200, {
    description: 'placed order',
  })
  async placeOrder(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,

    @requestBody()
    orderData: PlaceOrderRequest,
  ) {
    const userId = Number(currentUser.id);
    return this.checkoutFacade.placeOrder(userId, orderData);
  }

  @authenticate('jwt')
  @get('/orders/my-orders')
  @response(200, {
    description: 'my orders',
  })
  async getMyOrders(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
  ) {
    const userId = Number(currentUser.id);
    return this.orderService.getMyOrders(userId);
  }

  @authenticate('jwt')
  @get('/orders/{orderId}')
  @response(200, {
    description: 'Get order by id',
  })
  async getOrderById(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.number('orderId') orderId: number,
  ) {
    const userId = Number(currentUser.id);
    return this.orderService.getOrderById(userId, orderId);
  }

  @authenticate('jwt')
  @patch('/orders/cancel/{orderId}')
  @response(200, {
    description: 'cancel order',
  })
  async cancelOrder(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,
    @param.path.number('orderId') orderId: number,
  ) {
    const userId = Number(currentUser.id);
    return this.orderService.cancelOrder(userId, orderId);
  }
@authorize({
  allowedRoles: [Roles.ADMIN],
})
  @patch('/orders/{id}/status')
  async updateOrderStatus(
    @param.path.number('id') id: number,

    @requestBody()
    body: UpdateOrderStatusRequest,
  ) {
    return this.orderService.updateOrderStatus(id, body.order_status);
  }
  @authenticate('jwt')
  @authorize({
    allowedRoles: [Roles.ADMIN],
  })
  @get('/orders')
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @get('/orders/admin/{id}')
  @authenticate('jwt')
  async getOrderByIdForAdmin(@param.path.number('id') id: number) {
    return this.orderService.getOrderByIdForAdmin(id);
  }

  @del('/orders/{id}')
  @authenticate('jwt')
  async deleteOrder(@param.path.number('id') id: number) {
    return this.orderService.deleteOrder(id);
  }
}
