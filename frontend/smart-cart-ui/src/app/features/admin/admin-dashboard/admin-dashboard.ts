import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { ProductService } from '../../products/product';
import { CategoryService } from '../../categories/category.service';
import { OrderService } from '../../orders/order';
import { UserService } from '../../user/user';
import { map } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss'],
})
export class AdminDashboard implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
 
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private orderService = inject(OrderService);
  private userService = inject(UserService);

  totalProducts$ = this.productService.getProducts().pipe(map((products)=>products.length));

  totalCategories$ = this.categoryService.getCategories().pipe(map((categories)=>categories.length));

  totalOrders$ = this.orderService.getOrders().pipe(map((orders)=>orders.length));
  totalUsers$ = this.userService.getUsers().pipe(map((users)=>users.length));
}
