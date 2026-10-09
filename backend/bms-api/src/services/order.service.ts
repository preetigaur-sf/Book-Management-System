import {injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  CartRepository,
  OrderItemRepository,
  OrderRepository,
  ProductRepository,
} from '../repositories';
import {PlaceOrderRequest} from '../models';
import {OrderFactory} from '../factories/order.factory';
import {OrderSubject} from '../observers/order.subject';
import {NotificationObserver} from '../observers/notification.observer';
import {NotificationServiceService} from './notification.service';

@injectable()
export class OrderService {
  private orderSubject = new OrderSubject();
  private notificationObserver = new NotificationObserver();

  constructor(
    @repository(OrderRepository)
    public orderRepository: OrderRepository,

    @repository(OrderItemRepository)
    public orderItemRepository: OrderItemRepository,

    @repository(CartRepository)
    public cartRepository: CartRepository,

    @repository(ProductRepository)
    public productRepository: ProductRepository,

    @service(NotificationServiceService)
    public notificationService: NotificationServiceService,
  ) {
    this.orderSubject.subscribe(this.notificationObserver);
  }

  async placeOrder(
    userId: number,
    orderData: PlaceOrderRequest,
  ): Promise<object> {
    const cartItems = await this.cartRepository.find({
      where: {
        user_id: userId,
      },
      include: [
        {
          relation: 'product',
        },
      ],
    });

    if (cartItems.length === 0) {
      throw new Error('Cart is empty.');
    }

    let totalAmount = 0;

    for (let i = 0; i < cartItems.length; i++) {
      totalAmount += cartItems[i].quantity * cartItems[i].product!.price;
    }

    const newOrder = OrderFactory.createOrder(userId, totalAmount);

    const order = await this.orderRepository.create(newOrder);

    for (let i = 0; i < cartItems.length; i++) {
      await this.orderItemRepository.create({
        order_id: order.id!,
        product_id: cartItems[i].product_id,
        quantity: cartItems[i].quantity,
        price: cartItems[i].product!.price,
      });
    }

    for (let i = 0; i < cartItems.length; i++) {
      await this.productRepository.updateById(cartItems[i].product_id, {
        stock_quantity:
          cartItems[i].product!.stock_quantity - cartItems[i].quantity,
      });
    }

    for (let i = 0; i < cartItems.length; i++) {
      await this.cartRepository.deleteById(cartItems[i].id);
    }

    this.orderSubject.notify(`Order #${order.id} placed successfully.`);

    await this.notificationService.createNotification(
      userId,
      'Order Placed',
      `Your order #${order.id} has been placed successfully.`,
      'ORDER',
    );

    return {
      message: 'Order placed successfully.',
      orderId: order.id,
      totalAmount,
    };
  }

  async getMyOrders(userId: number) {
    return this.orderRepository.find({
      where: {
        user_id: userId,
      },
      include: [
        {
          relation: 'orderItems',
        },
      ],
    });
  }

  async getOrderById(userId: number, orderId: number) {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
        user_id: userId,
      },
      include: [
        {
          relation: 'orderItems',
        },
      ],
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  async cancelOrder(userId: number, orderId: number): Promise<object> {
    const order = await this.orderRepository.findById(orderId);

    if (order.user_id !== userId) {
      throw new Error('You are not authorized to cancel this order');
    }

    if (order.order_status !== 'PLACED') {
      throw new Error('Order cannot be cancelled');
    }

    await this.orderRepository.updateById(orderId, {
      order_status: 'CANCELLED',
    });

    await this.notificationService.createNotification(
      userId,
      'Order Cancelled',
      `Order #${orderId} cancelled successfully.`,
      'ORDER',
    );

    return {
      message: 'Order Cancelled Successfully',
    };
  }

  async updateOrderStatus(
    orderId: number,
    orderStatus: string,
  ): Promise<object> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    await this.orderRepository.updateById(orderId, {
      order_status: orderStatus,
    });
    await this.notificationService.createNotification(
      order.user_id,
      'Order Status Updated',
      `Your order #${order.id} status changed to ${orderStatus}.`,
      'ORDER',
    );

    return {
      message: 'Order status updated successfully',
    };
  }

  async getAllOrders() {
    return this.orderRepository.find({
      include: [
        {
          relation: 'orderItems',
        },
      ],
    });
  }

  async getOrderByIdForAdmin(orderId: number) {
    return this.orderRepository.findById(orderId, {
      include: [
        {
          relation: 'orderItems',
        },
      ],
    });
  }

  async deleteOrder(orderId: number): Promise<object> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    await this.orderItemRepository.deleteAll({
      order_id: orderId,
    });

    await this.orderRepository.deleteById(orderId);

    return {
      message: 'Order deleted successfully',
    };
  }
}
