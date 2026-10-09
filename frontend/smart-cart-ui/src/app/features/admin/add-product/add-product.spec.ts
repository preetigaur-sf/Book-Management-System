import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProduct } from './add-product';
import { Product } from '../../../core/models/product';
import { ProductService } from '../../products/product';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('AddProduct', () => {
  let component: AddProduct;
  let fixture: ComponentFixture<AddProduct>;
  let productService: ProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProduct],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        {
          provide: ProductService,
          useValue: {
            addProduct: () => of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddProduct);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add product successfully', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router,'navigate').mockResolvedValue(true as never);
    vi.spyOn(window,'alert').mockImplementation(()=>{});
    const updateSpy = vi.spyOn(productService, 'addProduct').mockReturnValue(of());
    component.productForm.setValue({
      name: 'Laptop',
      description: 'HP Laptop',
      price: 50000,
      stock_quantity: 10,
      sku: 'HP001',
      image_url: 'laptop.jpg',
      brand_id: 1,
      category_id: 1,
    });
    component.saveProduct();
    expect(updateSpy).toHaveBeenCalled();
  });
});
