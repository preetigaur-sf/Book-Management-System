import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Order } from '../../../core/models/order';
import { OrderService } from '../../orders/order';

@Component({
  selector: 'app-edit-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './edit-order.html',
  styleUrl: './edit-order.scss',
})
export class EditOrder implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);

  order!: Order;

  orderId!: number;

  selectedStatus = '';

  ngOnInit(): void {

    this.orderId = Number(
      this.route.snapshot.paramMap.get('id'),
    );

    this.loadOrder();

  }

  loadOrder(): void {

    this.orderService.getOrderById(this.orderId)
      .subscribe({

        next: (response) => {

          this.order = response;

          this.selectedStatus =
            response.order_status;

        },

        error: (err) => {

          console.error(err);

        },

      });

  }

  updateStatus(): void {

    this.orderService
      .updateOrderStatus(
        this.orderId,
        this.selectedStatus,
      )
      .subscribe({

        next: () => {

          alert('Order updated successfully');

          this.router.navigate([
            '/admin/orders',
          ]);

        },

        error: (err) => {

          console.error(err);

          alert('Failed to update');

        },

      });

  }

}