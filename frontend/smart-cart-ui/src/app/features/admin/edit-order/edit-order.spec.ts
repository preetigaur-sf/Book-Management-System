import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditOrder } from './edit-order';
import { provideRouter, ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { OrderService } from '../../orders/order';
import { of } from 'rxjs';
import { Order } from '../../../core/models/order';

describe('EditOrder', () => {
  let component: EditOrder;
  let fixture: ComponentFixture<EditOrder>;
  let orderService: OrderService;
  const mockOrder: Order = {
    id: 1,
    user_id: 1,
    total_amount: 500,
    order_date: '2026-07-10',
    order_status: 'Pending',
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOrder],
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
          },
        },
        {
          provide: OrderService,
          useValue: {
            getOrderById: () => of([]),
            updateOrderStatus: () => of(void 0),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditOrder);
    component = fixture.componentInstance;
    orderService = TestBed.inject(OrderService);
    vi.spyOn(orderService, 'getOrderById').mockReturnValue(of(mockOrder));
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load order on init', () => {
    expect(orderService.getOrderById).toHaveBeenCalledWith(1);
    expect(component.order).toEqual(mockOrder);
    expect(component.selectedStatus).toBe(mockOrder.order_status);
  });

  it('should update order successfully', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true as never);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    const updateSpy = vi.spyOn(orderService, 'updateOrderStatus').mockReturnValue(of(void 0));
    component.selectedStatus = 'Delivered';
    component.updateStatus();
    expect(updateSpy).toHaveBeenCalled();
  });
});
