import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss',
})
export class Wishlist implements OnInit {
  private wishlistService = inject(WishlistService);
  private cdr = inject(ChangeDetectorRef);
  wishlist: any[] = [];

  ngOnInit(): void {
    this.loadWishlist();

  }

  loadWishlist() {
    console.log('loadWishlist Called');

    this.wishlistService.getWishlist().subscribe({
      next: (response) => {
        console.log('API Response:', response);

        this.wishlist = response;

        console.log('Wishlist Length:', this.wishlist.length);
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }
  remove(id: number) {
    this.wishlistService.removeWishlist(id).subscribe({
      next: () => {
        this.loadWishlist();
      },
    });
  }
}
