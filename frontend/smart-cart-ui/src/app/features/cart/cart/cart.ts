import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../orders/order';
import { CartService } from './cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit {
  private cartService = inject(CartService);
  private cdr = inject(ChangeDetectorRef);
  private orderService = inject(OrderService);

  cartItems: any[] = [];
  totalAmount = 0;
  shippingAddress = '';

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (response) => {
        console.log('Cart Response:', response);

        this.cartItems = [...response];

        this.totalAmount = 0;
        for (let i = 0; i < this.cartItems.length; i++) {
          this.totalAmount =
            this.totalAmount + this.cartItems[i].product.price * this.cartItems[i].quantity;
        }
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }
  increaseQuantity(item: any): void {
    this.cartService.updateQuantity(item.id, item.quantity + 1).subscribe({
      next: (response) => {
        console.log(response);

        this.loadCart();
      },

      error: (err) => {
        console.error(err);

        alert(err.error?.message ?? 'Failed to update quantity');
      },
    });
  }
  decreaseQuantity(item: any): void {
    if (item.quantity === 1) {
      return;
    }

    this.cartService.updateQuantity(item.id, item.quantity - 1).subscribe({
      next: (response) => {
        console.log(response);

        this.loadCart();
      },

      error: (err) => {
        console.error(err);

        alert(err.error?.message ?? 'Failed to update quantity');
      },
    });
  }
  removeCart(item: any): void {
    this.cartService.removeCart(item.id).subscribe({
      next: (response) => {
        console.log(response);

        this.cartItems = this.cartItems.filter((cart) => cart.id !== item.id);

        this.cdr.detectChanges();

        alert('Product removed from cart');
      },

      error: (err) => {
        console.error(err);

        alert(err.error?.message ?? 'Failed to remove product');
      },
    });
  }

  placeOrder(): void {
    if (this.shippingAddress == '') {
      alert('Please enter shipping address');
      return;
    }

    this.orderService.placeOrder(this.shippingAddress).subscribe({
      next: (response) => {
        console.log(response);

        alert('Order placed successfully');

        this.shippingAddress = '';

        this.loadCart();
      },

      error: (err) => {
        console.error(err);

        alert('Failed to place order');
      },
    });
  }
}
