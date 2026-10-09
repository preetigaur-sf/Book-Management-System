import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditCategory } from './edit-category';
import { provideRouter,ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { CategoryService } from '../../categories/category.service';
import { of } from 'rxjs';
import { Category } from '../../../core/models/category';

describe('EditCategory', () => {
  let component: EditCategory;
  let fixture: ComponentFixture<EditCategory>;
  let categoryService:CategoryService;
  const mockCategory:Category={
    id:1,
    name:'Electronics',
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCategory],
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
        provide:CategoryService,
        useValue:{
          getCategoryById:()=> of([]),
          updateCategory:()=> of(void 0),
        },
      },
    ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCategory);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService);
    vi.spyOn(categoryService,'getCategoryById').mockReturnValue(of(mockCategory));
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should load Category on init',()=>{
    expect(categoryService.getCategoryById).toHaveBeenCalledWith(1);
    expect(component.categoryForm.value.name).toBe(mockCategory.name);
  });
  it('should update category successfully', () => {
  const router = TestBed.inject(Router);

  vi.spyOn(router, 'navigate').mockResolvedValue(true as never);

  vi.spyOn(window, 'alert').mockImplementation(() => {});

  const updateSpy = vi
    .spyOn(categoryService, 'updateCategory')
    .mockReturnValue(of(void 0));
  component.updateCategory();
  expect(updateSpy).toHaveBeenCalled();

});
});
