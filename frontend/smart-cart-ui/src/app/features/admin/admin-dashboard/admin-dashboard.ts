import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { ProductService } from '../../products/product';
import { CategoryService } from '../../categories/category.service';
import { OrderService } from '../../orders/order';
import { UserService } from '../../user/user';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss'],
})
export class AdminDashboard implements OnInit {
  
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private orderService = inject(OrderService);
  private userService = inject(UserService);

  totalProducts = 0;
  totalCategories = 0;
  totalOrders = 0;
  totalUsers = 0;

  ngOnInit(): void {
    this.loadCounts();
  }

  loadCounts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('products:', products);
        this.totalProducts = products.length;
        console.log('totalProducts =', this.totalProducts);
      },
    });

    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        console.log('categories:', categories);
        this.totalCategories = categories.length;
        console.log('totalCategories =', this.totalCategories);
      },
    });

    this.orderService.getOrders().subscribe({
      next: (orders) => {
        console.log('orders:', orders);
        this.totalOrders = orders.length;
        console.log('totalOrders =', this.totalOrders);
      },
    });

    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('users:', users);
        this.totalUsers = users.length;
        console.log('totalUsers =', this.totalUsers);
      },
    });
  }
}
