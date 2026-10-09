import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditBrand } from './edit-brand';
import { provideRouter,ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { BrandService } from '../../brand/brand';
import { of } from 'rxjs';
import { Brand } from '../../../core/models/brand';

describe('EditBrand', () => {
  let component: EditBrand;
  let fixture: ComponentFixture<EditBrand>;
  let brandService:BrandService;
  const mockBrand:Brand={
    id:1,
    name:'HP',
    description:'HP Brand',
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBrand],
      providers:[provideRouter([]), provideHttpClient(),{
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
        provide:BrandService,
        useValue:{
          getBrandById:()=>of([]),
          updateBrand:()=> of([]),
        }
      }
    ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditBrand);
    component = fixture.componentInstance;
    brandService = TestBed.inject(BrandService);
    vi.spyOn(brandService,'getBrandById').mockReturnValue(of(mockBrand));
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load Brand on init',()=>{
    expect(brandService.getBrandById).toHaveBeenCalledWith(1);
    expect(component.brandForm.value.name).toBe(mockBrand.name);
    expect(component.brandForm.value.description).toBe(mockBrand.description);
  });

  it('should update brand successfully',()=>{
    const router = TestBed.inject(Router);
    vi.spyOn(router,'navigate').mockResolvedValue(true as never);
    vi.spyOn(window,'alert').mockImplementation(()=>{});
    const updateSpy = vi.spyOn(brandService,'updateBrand').mockReturnValue(of(void 0));
    component.brandForm.setValue({
      name:'HP',
      description:'HP Brand',
    });
    component.updateBrand();
    expect(updateSpy).toHaveBeenCalled();
  });
});
