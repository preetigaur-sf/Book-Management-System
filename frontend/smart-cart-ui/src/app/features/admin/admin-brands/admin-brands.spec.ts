import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminBrands } from './admin-brands';
import { provideRouter, ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { BrandService } from '../../brand/brand';
import { of } from 'rxjs';
import { Brand } from '../../../core/models/brand';

describe('AdminBrands', () => {
  let component: AdminBrands;
  let fixture: ComponentFixture<AdminBrands>;
  let brandService: BrandService;

  const mockBrands: Brand[] = [
    {
      id: 1,
      name: 'HP',
      description: 'HP Brand',
    },
  ];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBrands],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            Snapshot: {
              paramsMap: {
                get: () => '1',
              },
            },
            param: {
              subscribe: () => {},
            },
          },
        },
        {
          provide: BrandService,
          useValue: {
            getBrands: () => of([]),
            deleteBrands: () => of(void 0),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBrands);
    component = fixture.componentInstance;
    brandService = TestBed.inject(BrandService);
    vi.spyOn(brandService, 'getBrands').mockReturnValue(of(mockBrands));
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load brands on init', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true as never);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    expect(brandService.getBrands).toHaveBeenCalled();
    expect(component.brands).toEqual(mockBrands);
  });
});
