import {Order} from '../models';

export class OrderFactory {
  static createOrder(
    userId: number,
    totalAmount: number,
  ): Partial<Order> {
    return {
      user_id: userId,
      total_amount: totalAmount,
      order_status: 'PLACED',
      order_date: new Date().toISOString(),
    };
  }
}