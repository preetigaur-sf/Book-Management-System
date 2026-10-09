import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductService } from '../../products/product';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss',
})
export class AddProduct {
  private formbuilder = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  productForm = this.formbuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, Validators.required],
    stock_quantity: [0, Validators.required],
    sku: ['', Validators.required],
    image_url: ['', Validators.required],
    brand_id: [1, Validators.required],
    category_id: [1, Validators.required],
  });

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    this.productService.addProduct(this.productForm.value as any).subscribe({
      next: () => {
        alert('Product Added Successfully');
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to Add Product');
      },
    });
  }
}
