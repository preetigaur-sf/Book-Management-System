import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Api } from '../../core/services/api';
import { Brand } from '../../core/models/brand';

@Injectable({
  providedIn: 'root',
})
export class BrandService {

  private api = inject(Api);

  getBrands(): Observable<Brand[]> {
    return this.api.get<Brand[]>('brands');
  }

  getBrandById(id: number): Observable<Brand> {
    return this.api.get<Brand>(`brands/${id}`);
  }

  addBrand(brand: Brand): Observable<Brand> {
    return this.api.post<Brand>('brands', brand);
  }

  updateBrand(id: number, brand: Brand): Observable<void> {
    return this.api.patch<void>(`brands/${id}`, brand);
  }

  deleteBrand(id: number): Observable<void> {
    return this.api.delete<void>(`brands/${id}`);
  }

}