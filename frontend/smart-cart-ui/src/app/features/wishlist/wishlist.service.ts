import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Wishlist } from './wishlist/wishlist';
import { Api } from '../../core/services/api';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {

  private api = inject(Api);

  getWishlist(){
    return this.api.get<any[]>('wishlist');
  }
  addToWishlist(productId: number): Observable<any> {

    return this.api.post('wishlist', {
      product_id: productId,
    });

  }

  removeWishlist(id:number){
    return this.api.delete(`wishlist/${id}`);
  }

}