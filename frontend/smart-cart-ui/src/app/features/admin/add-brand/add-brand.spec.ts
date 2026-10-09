import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddBrand } from './add-brand';
import { of } from 'rxjs';
import { Brand } from '../../../core/models/brand';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { BrandService } from '../../brand/brand';
describe('AddBrand', () => {
  let component: AddBrand;
  let fixture: ComponentFixture<AddBrand>;
  let brandService: BrandService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBrand],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapsort: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },
        {
          provide: BrandService,
          useValue: {
            addBrand: () => of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddBrand);
    component = fixture.componentInstance;
    brandService = TestBed.inject(BrandService);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add brand successfully', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true as never);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    const updateSpy = vi.spyOn(brandService, 'addBrand').mockReturnValue(of());
    component.brandForm.setValue({
      name: 'HP',
      description: 'HP Brand',
    });
    component.saveBrand();
    expect(updateSpy).toHaveBeenCalled();
  });
});
