import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProduct } from './edit-product';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ProductService } from '../../products/product';
import { Product } from '../../../core/models/product';
import { EditReview } from '../edit-review/edit-review';
import { ReviewService } from '../../product-review/review';

describe('EditProduct', () => {
  let component: EditProduct;
  let fixture: ComponentFixture<EditProduct>;
  let productService: ProductService;
  let reviewService:ReviewService;
  const mockProduct: Product = {
    id: 1,
    name: 'Laptop',
    description: 'HP Laptop',
    price: 30000,
    stock_quantity: 20,
    sku: 'HP001',
    image_url: 'laptop.jpg',
    category_id: 1,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProduct],
      providers: [
        provideRouter([]),

        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },

        {
          provide: ProductService,
          useValue: {
            getProductById: () => of({}),
            updateProduct: () => of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProduct);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    vi.spyOn(productService, 'getProductById').mockReturnValue(of(mockProduct));
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product on init', () => {
    expect(productService.getProductById).toHaveBeenCalledWith(1);
    expect(component.productForm.value.name).toBe(mockProduct.name);
    expect(component.productForm.value.price).toBe(mockProduct.price);
  });

  it('should update product successfully', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router,'navigate').mockResolvedValue(true as never);
    vi.spyOn(window,'alert').mockImplementation(()=>{});
    const updateSpy = vi.spyOn(productService, 'updateProduct').mockReturnValue(of(void 0));

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
    component.updateProduct();
    expect(updateSpy).toHaveBeenCalled();
  });
});
