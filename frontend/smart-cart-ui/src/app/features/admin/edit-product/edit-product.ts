import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';

import { ProductService } from '../../products/product';
import { Product } from '../../../core/models/product';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.scss',
})
export class EditProduct implements OnInit {

  private formbuilder = inject(FormBuilder);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  productId!: number;

  productForm = this.formbuilder.group({
    name: ['', Validators.required],
    description: [''],
    price: [0, Validators.required],
    stock_quantity: [0, Validators.required],
    sku: ['', Validators.required],
    image_url: [''],
    brand_id: [1, Validators.required],
    category_id: [1, Validators.required],
  });

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct();
  }

  loadProduct(): void {
    this.productService.getProductById(this.productId).subscribe({
      next: (product: Product) => {
        this.productForm.patchValue(product);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to load product');
      },
    });
  }

  updateProduct(): void {

    if (this.productForm.invalid) {
      return;
    }

    const formValue = this.productForm.getRawValue();

    const product: Product = {
      id: this.productId,
      ...formValue,
      price: Number(formValue.price),
      stock_quantity: Number(formValue.stock_quantity),
      brand_id: Number(formValue.brand_id),
      category_id: Number(formValue.category_id),
    } as Product;

    this.productService.updateProduct(this.productId, product).subscribe({
      next: () => {
        alert('Product Updated Successfully');
        this.router.navigate(['/admin/products']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to Update Product');
      },
    });
  }

}
