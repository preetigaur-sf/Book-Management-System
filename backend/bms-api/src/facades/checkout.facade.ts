import {injectable, service} from '@loopback/core';

import {OrderService} from '../services';
import {PlaceOrderRequest} from '../models';

@injectable()
export class CheckoutFacade {
  constructor(
    @service(OrderService)
    public orderService: OrderService,
  ) {}

  async placeOrder(
    userId: number,
    orderData: PlaceOrderRequest,
  ) {
    return this.orderService.placeOrder(
      userId,
      orderData,
    );
  }
}