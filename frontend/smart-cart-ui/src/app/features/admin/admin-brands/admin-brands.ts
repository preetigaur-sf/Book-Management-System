import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { BrandService } from '../../brand/brand';
import { Brand } from '../../../core/models/brand';

@Component({
  selector: 'app-admin-brands',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-brands.html',
  styleUrl: './admin-brands.scss',
})
export class AdminBrands implements OnInit {
  private brandService = inject(BrandService);

  private cdr = inject(ChangeDetectorRef);

  brands: Brand[] = [];

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.brandService.getBrands().subscribe({
      next: (response) => {
        console.log('Brands:', response);

        this.brands = [...response];

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }

  deleteBrand(id: number): void {
    if (!confirm('Delete This Brand?')) {
      return;
    }

    this.brandService.deleteBrand(id).subscribe({
      next: () => {
        alert('Brand Deleted Successfully');

        this.loadBrands();
      },

      error: (err) => {
        console.error(err);

        alert('Failed To Deleted Brand');
      },
    });
  }
}
