import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Api } from '../../core/services/api';
import { Product } from '../../core/models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private api = inject(Api);

  getProducts(): Observable<Product[]> {
    return this.api.get<Product[]>('products');
  }

  getProductById(id: number): Observable<Product> {
    return this.api.get<Product>(`products/${id}`);
  }
  addProduct(product: Product): Observable<Product> {
    return this.api.post<Product>('products', product);
  }

  updateProduct(id: number, product: Product): Observable<void> {
    return this.api.patch<void>(`products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.api.delete<void>(`products/${id}`);
  }
}
