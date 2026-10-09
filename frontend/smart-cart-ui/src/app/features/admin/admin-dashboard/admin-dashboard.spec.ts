import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboard } from './admin-dashboard';
import { of } from 'rxjs';
import { ProductService } from '../../products/product';
import { CategoryService } from '../../categories/category.service';
import { OrderService } from '../../orders/order';
import { UserService } from '../../user/user';

describe('AdminDashboard', () => {
 
  let component: AdminDashboard;
  let fixture: ComponentFixture<AdminDashboard>;
  let productService: ProductService;
  let categoryService: CategoryService;
  let orderservice: OrderService;
  let userservice: UserService;
  
  const mockProducts = [{ id: 1 }];
  const mockCategories = [{ id: 1 }];
  const mockOrders = [{ id: 1 }];
  const mockUsers = [{ id: 1 }];
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboard],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getProducts: () => of([]),
          },
        },
        {
          provide: CategoryService,
          useValue: {
            getCategories: () => of([]),
          },
        },
        {
          provide: OrderService,
          useValue: {
            getOrders: () => of([]),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUsers: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboard);
    component = fixture.componentInstance;
    
    productService = TestBed.inject(ProductService);
    categoryService = TestBed.inject(CategoryService);
    orderservice = TestBed.inject(OrderService);
    userservice = TestBed.inject(UserService);
    
    vi.spyOn(productService, 'getProducts').mockReturnValue(of(mockProducts as any));
    vi.spyOn(categoryService, 'getCategories').mockReturnValue(of(mockCategories as any));
    vi.spyOn(orderservice, 'getOrders').mockReturnValue(of(mockOrders as any));
    vi.spyOn(userservice, 'getUsers').mockReturnValue(of(mockUsers as any));

    await fixture.whenStable();
    fixture.detectChanges();
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load dashboard  count on init', () => {
    expect(productService.getProducts).toHaveBeenCalled();
    expect(categoryService.getCategories).toHaveBeenCalled();
    expect(orderservice.getOrders).toHaveBeenCalled();
    expect(userservice.getUsers).toHaveBeenCalled();
    
    expect(component.totalProducts).toBe(1);
    expect(component.totalCategories).toBe(1);
    expect(component.totalOrders).toBe(1);
    expect(component.totalUsers).toBe(1);
  });

});
