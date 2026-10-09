import { Component, OnInit, inject,ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../core/models/product';
import { ProductService } from '../product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList implements OnInit {

  private productService = inject(ProductService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];

  ngOnInit(): void {

    this.productService.getProducts().subscribe({

      next: (response) => {

        console.log(response);

        this.products = response;
        this.cdr.detectChanges();
        console.log('products:',this.products);
        console.log('product length:', this.products.length);

      },

      error: (err) => {

        console.error(err);

      }

    });

  }
  viewProduct(id:number):void{
    this.router.navigate(['/dashboard/products',id]);
  }

}