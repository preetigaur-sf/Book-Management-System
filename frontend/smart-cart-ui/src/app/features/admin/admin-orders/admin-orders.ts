import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { OrderService } from '../../orders/order';
import { Order } from '../../../core/models/order';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.scss',
})
export class AdminOrders implements OnInit {

  private orderService = inject(OrderService);

  private cdr = inject(ChangeDetectorRef);

  orders: Order[] = [];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {

    this.orderService.getOrders().subscribe({

      next: (response) => {

        console.log('Orders:', response);

        this.orders = [...response];

        this.cdr.detectChanges();

      },

      error: (err) => {

        console.error(err);

      },

    });

  }

  deleteOrder(id: number): void {

    if (!confirm('Delete this order?')) {
      return;
    }

    this.orderService.deleteOrder(id).subscribe({

      next: () => {

        alert('Order deleted successfully');

        this.loadOrders();

      },

      error: (err) => {

        console.error(err);

        alert('Failed to delete order');

      },

    });

  }

}