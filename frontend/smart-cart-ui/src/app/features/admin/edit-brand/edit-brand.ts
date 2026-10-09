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

import { BrandService } from '../../brand/brand';
import { Brand } from '../../../core/models/brand';

@Component({
  selector: 'app-edit-brand',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-brand.html',
  styleUrl: './edit-brand.scss',
})
export class EditBrand implements OnInit {

  private formbuilder = inject(FormBuilder);
  private brandService = inject(BrandService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  brandId!: number;

  brandForm = this.formbuilder.group({
    name: ['', Validators.required],
    description: [''],
  });

  ngOnInit(): void {

    this.brandId = Number(this.route.snapshot.paramMap.get('id'));

    this.loadBrand();

  }

  loadBrand(): void {

    this.brandService.getBrandById(this.brandId).subscribe({

      next: (brand: Brand) => {

        this.brandForm.patchValue({
          name: brand.name,
          description: brand.description,
        });

      },

      error: (err) => {

        console.error(err);

        alert('Failed to load brand');

      },

    });

  }

  updateBrand(): void {

    if (this.brandForm.invalid) {
      return;
    }

    this.brandService.updateBrand(
      this.brandId,
      this.brandForm.value as Brand
    ).subscribe({

      next: () => {

        alert('Brand Updated Successfully');

        this.router.navigate(['/admin/brands']);

      },

      error: (err) => {

        console.error(err);

        alert('Failed to Update Brand');

      },

    });

  }

}