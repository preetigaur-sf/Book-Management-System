import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Wishlist } from './wishlist';
import { WishlistService } from '../wishlist.service';
import { of } from 'rxjs';

describe('Wishlist', () => {
  let component: Wishlist;
  let fixture: ComponentFixture<Wishlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Wishlist],
      providers:[{
        provide:WishlistService,
        useValue:{
          getWishlist:()=> of([]),
          removeFromWishlist:()=> of([]),
        },
      },
    ],
    }).compileComponents();

    fixture = TestBed.createComponent(Wishlist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
