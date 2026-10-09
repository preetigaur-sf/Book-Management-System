import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminOrders } from './admin-orders';
import { OrderService } from '../../orders/order';
import { of } from 'rxjs';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Order } from '../../../core/models/order';


describe('AdminOrders', () => {
  let component: AdminOrders;
  let fixture: ComponentFixture<AdminOrders>;
  let orderService: OrderService;
  const mockOrders: Order[] = [
    {
      id: 1,
      user_id: 1,
      total_amount: 500,
      order_status: 'Pending',
      order_date: '2026-07-10',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOrders],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            Snapshot: {
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
          provide: OrderService,
          useValue: {
            getOrders: () => of([]),
            deleteOrder: () => of(void 0),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminOrders);
    component = fixture.componentInstance;
    orderService = TestBed.inject(OrderService);
    vi.spyOn(orderService, 'getOrders').mockReturnValue(of(mockOrders));
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load orders on init', () => {
    expect(orderService.getOrders).toHaveBeenCalled();
    expect(component.orders).toEqual(mockOrders);
  });

  it('should delete order and reload orders', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const deleteSpy = vi.spyOn(orderService, 'deleteOrder').mockReturnValue(of(void 0));
    const loadSpy = vi.spyOn(component, 'loadOrders');
    component.deleteOrder(1);
    expect(deleteSpy).toHaveBeenCalledWith(1);
    expect(loadSpy).toHaveBeenCalled();
  });
});
