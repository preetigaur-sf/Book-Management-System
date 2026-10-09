import { Component, OnInit, inject,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../products/product';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.scss',
})
export class AdminProducts implements OnInit {

  private productService = inject(ProductService);
  private cdx = inject(ChangeDetectorRef);
  products: Product[] = [];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {

    console.log("Loading Products");
    this.productService.getProducts().subscribe({

      next: (response) => {
        console.log("Products:",response);
        this.products = [...response];
        console.log("After Assign:",this.products);
        this.cdx.detectChanges();

      },

      error: (err) => {

        console.error(err);

      },

    });

  }

  deleteProduct(id: number): void {

    if (!confirm('Delete this product?')) {
      return;
    }

    this.productService.deleteProduct(id).subscribe({

      next: () => {

        alert('Product deleted successfully');

        this.loadProducts();

      },

      error: (err) => {

        console.error(err);

        alert('Failed to delete product');

      },

    });

  }

}