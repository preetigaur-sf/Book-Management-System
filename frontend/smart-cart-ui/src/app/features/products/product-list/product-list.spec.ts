import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductList } from './product-list';
import { of } from 'rxjs';
import { ProductService } from '../product';
import { ActivatedRoute } from '@angular/router';
import { Snapshots } from 'vitest';
describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getProducts: () => of([]),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            Snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
