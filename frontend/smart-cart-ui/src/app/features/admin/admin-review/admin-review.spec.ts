import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminReviews } from './admin-review';
import { of } from 'rxjs';
import { ReviewService } from '../../product-review/review';
import { ProductReview } from '../../../core/models/product-review';
import { provideRouter,ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('AdminReview', () => {
  let component: AdminReviews;
  let fixture: ComponentFixture<AdminReviews>;
  let reviewService: ReviewService;
  const mockReviews: ProductReview[] = [
    {
      id: 1,
      rating: 5,
      comment: 'Good Product',
      user_id: 1,
      product_id: 1,
      created_at: '2026-07-11',
      updated_at: '2026-07-11',
      user: {
        id: 1,
        first_name: 'Preeti',
        last_name: 'Gaur',
        email: 'preeti@test.com',
      },
      product: {
        id: 1,
        name: 'Laptop',
      },
    },
  ];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReviews],
      providers: [provideHttpClient(),provideRouter([]),{
        provide:ActivatedRoute,
        useValue:{
          snapshot:{
            paramMap:{
              get:()=>'1',
            },
          },
        },
      },
        {
          provide: ReviewService,
          useValue: {
            getReviews: () => of([]),
            deleteReview: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminReviews);
    component = fixture.componentInstance;
    reviewService = TestBed.inject(ReviewService);
    vi.spyOn(reviewService, 'getReviews').mockReturnValue(of(mockReviews));
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load reviews on init', () => {
    expect(reviewService.getReviews).toHaveBeenCalled();
    expect(component.reviews).toEqual(mockReviews);
  });
});
