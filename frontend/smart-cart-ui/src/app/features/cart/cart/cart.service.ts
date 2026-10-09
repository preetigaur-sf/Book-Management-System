import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Api } from '../../../core/services/api';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private api = inject(Api);

  getCart(): Observable<any[]> {
    return this.api.get<any[]>('cart');
  }

  addToCart(productId: number, quantity: number): Observable<any> {

    return this.api.post('cart/add', {
      product_id: productId,
      quantity: quantity,
    });
  }

  updateQuantity(cartId: number, quantity: number): Observable<any> {
    return this.api.patch(`cart/update/${cartId}`, {
      quantity: quantity,
    });
  }

  removeCart(cartId: number): Observable<any> {
    return this.api.delete(`cart/remove/${cartId}`);
  }
}
