import { Component, OnInit, inject ,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderService } from '../orders/order';

@Component({
  selector: 'app-my-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-order.html',
  styleUrl: './my-order.scss',
})
export class MyOrder implements OnInit {
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  orders: any[] = [];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getMyOrders().subscribe({
      next: (response) => {
        console.log("My Order response:",response);
        console.log(response);
        this.orders = response;
        this.cdr.detectChanges();
        console.log(this.orders.length);
      },

      error: (err) => {
        console.error(err);
      },
    });
  }
}
