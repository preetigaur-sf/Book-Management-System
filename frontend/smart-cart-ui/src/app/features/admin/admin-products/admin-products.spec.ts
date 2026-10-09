import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminProducts } from './admin-products';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ProductService } from '../../products/product';
import { Product } from '../../../core/models/product';
describe('AdminProducts', () => {
  let component: AdminProducts;
  let fixture: ComponentFixture<AdminProducts>;
  let productService: ProductService;

  const mockProduct: Product[] = [
    {
      id: 1,
      name: 'Laptop',
      description: 'HP Laptop',
      price: 50000,
      stock_quantity: 10,
      sku: 'HP001',
      image_url: 'laptop.jpg',
      category_id: 1,
    },
  ];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProducts],
      providers: [
        provideRouter([]),
        provideHttpClient(),

        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
            params: {
              subscribe: () => {},
            },
          },
        },
        {
          provide: ProductService,
          useValue: {
            getProducts: () => of([]),
            deleteProduct: () => of([void 0]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProducts);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    vi.spyOn(productService, 'getProducts').mockReturnValue(of(mockProduct));
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    const router = TestBed.inject(Router);

    vi.spyOn(router, 'navigate').mockResolvedValue(true as never);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProduct);
  });

  it('should delete product and reload products', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const deleteSpy = vi.spyOn(productService, 'deleteProduct').mockReturnValue(of(void 0));

    const loadSpy = vi.spyOn(component, 'loadProducts');
    component.deleteProduct(1);
    expect(deleteSpy).toHaveBeenCalledWith(1);
    expect(loadSpy).toHaveBeenCalled();
    expect(window.confirm).toHaveBeenCalled();
  });

  it('should not delete product if user cancels', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const deleteSpy = vi.spyOn(productService, 'deleteProduct');
    component.deleteProduct(1);
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it('should handle error while loading products', () => {
    const error = new Error('Server Error');
    vi.spyOn(productService, 'getProducts').mockReturnValue(throwError(() => error));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    component.loadProducts();
    expect(productService.getProducts).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(error);
  });
});
