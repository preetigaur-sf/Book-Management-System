import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditReview } from './edit-review';
import { provideRouter,ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ReviewService } from '../../product-review/review';
import { of } from 'rxjs';
import { ProductReview } from '../../../core/models/product-review';

describe('EditReview', () => {
  let component: EditReview;
  let fixture: ComponentFixture<EditReview>;
  let reviewService:ReviewService;
  const mockReview: ProductReview = {
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
};
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditReview],
      providers:[provideRouter([]), provideHttpClient(),{
        provide:ActivatedRoute,
        useValue:{
          snapshot:{
            paramMap:{
              get:()=> '1',
            },
          },
        },
      },
      {
        provide:ReviewService,
        useValue:{
          getReviewById:()=> of([]),
          updateReview:()=> of({}),
        },
      },
    ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditReview);
    component = fixture.componentInstance;
    reviewService = TestBed.inject(ReviewService);
    vi.spyOn(reviewService,'getReviewById').mockReturnValue(of(mockReview))
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load review on init',()=>{
    expect(reviewService.getReviewById).toHaveBeenCalledWith(1);
    expect(component.reviewForm.value.rating).toBe(mockReview.rating);
    expect(component.reviewForm.value.comment).toBe(mockReview.comment);
  });

  it('should update review successfully', () => {
  const router  = TestBed.inject(Router);
  vi.spyOn(router,'navigate').mockResolvedValue(true as never);
  vi.spyOn(window,'alert').mockImplementation(()=>{

  })
  const updateSpy = vi
    .spyOn(reviewService,'updateReview')
    .mockReturnValue(of({}));

  component.reviewForm.setValue({
    rating: 5,
    comment: 'Good Product',
  });

  component.updateReview();

  expect(updateSpy).toHaveBeenCalled();

});
});
