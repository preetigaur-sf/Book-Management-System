import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Api } from '../../core/services/api';

export interface Category {
  id?: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  private api = inject(Api);

  getCategories(): Observable<Category[]> {
    return this.api.get<Category[]>('categories');
  }

  getCategoryById(id: number): Observable<Category> {
    return this.api.get<Category>(`categories/${id}`);
  }

  addCategory(category: Category): Observable<Category> {
    return this.api.post<Category>('categories', category);
  }

  updateCategory(id: number, category: Category): Observable<void> {
    return this.api.patch<void>(`categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.api.delete<void>(`categories/${id}`);
  }

}