import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Api } from '../../core/services/api';
import { Order } from '../../core/models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private api = inject(Api);

  getOrders(): Observable<Order[]> {
    return this.api.get<Order[]>('orders');
  }

  getOrderById(id: number): Observable<Order> {
    return this.api.get<Order>(`orders/admin/${id}`);
  }

  updateOrderStatus(id: number, order_status: string): Observable<void> {
    return this.api.patch<void>(`orders/${id}/status`, { order_status });
  }

  deleteOrder(id: number): Observable<void> {
    return this.api.delete<void>(`orders/${id}`);
  }
  placeOrder(shipping_address: string): Observable<any> {
    return this.api.post('orders/place-order', {
      shipping_address: shipping_address,
    });
  }

  getMyOrders(): Observable<Order[]> {
    return this.api.get<Order[]>('orders/my-orders');
  }
}
