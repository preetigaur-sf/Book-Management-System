import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../cart/cart/cart.service';
import { ProductService } from '../product';
import { Product } from '../../../core/models/product';
import { WishlistService } from '../../wishlist/wishlist.service';
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  product?: Product;
  isWishlisted = false;
  wishlistId?: number;
  quantity: number = 1;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.productService.getProductById(id).subscribe({
      next: (response) => {
        console.log(response);
        this.product = response;
        this.loadWishlist();
        this.cdr.detectChanges();
        console.log('product:', this.product);
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  addToWishlist(): void {
    if (!this.product) return;

    this.wishlistService.addToWishlist(this.product.id).subscribe({
      next: (response) => {
        console.log(response);
        this.loadWishlist();
        this.cdr.detectChanges();

        alert('Product added to wishlist');
      },

      error: (err) => {
        if (err.status === 409) {
          alert('product already in wishlist');
        } else {
          alert(err.error?.message ?? 'Failed to add wishlist');
        }
      },
    });
  }

  removeWishlist() {
    if (!this.wishlistId) return;

    this.wishlistService.removeWishlist(this.wishlistId).subscribe({
      next: () => {
        alert('Removed from wishlist');

        this.cdr.detectChanges();
        this.loadWishlist();
        this.isWishlisted = false;

        this.wishlistId = undefined;
      },

      error: (err) => {
        console.error(err);

        alert('Failed to remove wishlist');
      },
    });
  }

  loadWishlist() {
    this.wishlistService.getWishlist().subscribe({
      next: (items) => {
        const item = items.find((w) => w.product_id === this.product?.id);

        if (item) {
          this.isWishlisted = true;

          this.wishlistId = item.id;
        } else {
          this.isWishlisted = false;

          this.wishlistId = undefined;
        }
      },
    });
  }
  addToCart(): void {
    console.log('Add to Cart Clicked');
    if (!this.product) return;

    this.cartService.addToCart(this.product.id, this.quantity).subscribe({
      next: (response) => {
        console.log(response);

        alert('Product added to cart successfully');
      },

      error: (err) => {
        console.error(err);

        alert(err.error?.message ?? 'Failed to add product to cart');
      },
    });
  }

  increaseQuantity():void{
    this.quantity++;
  }
  decreaseQuantity():void{
    if(this.quantity>1){
      this.quantity--;
    }
  }
}
