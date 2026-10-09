import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { BrandService } from '../../brand/brand';
import { Brand } from '../../../core/models/brand';

@Component({
  selector: 'app-add-brand',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-brand.html',
  styleUrl: './add-brand.scss',
})
export class AddBrand {

  private fb = inject(FormBuilder);

  private brandService = inject(BrandService);

  private router = inject(Router);

  brandForm = this.fb.group({

    name: ['', Validators.required],

    description: [''],

  });

  saveBrand(): void {

    if (this.brandForm.invalid) {
      return;
    }

    this.brandService.addBrand(
      this.brandForm.value as Brand
    ).subscribe({

      next: () => {

        alert('Brand Added Successfully');

        this.router.navigate(['/admin/brands']);

      },

      error: (err) => {

        console.error(err);

        alert('Failed to Add Brand');

      },

    });

  }

}