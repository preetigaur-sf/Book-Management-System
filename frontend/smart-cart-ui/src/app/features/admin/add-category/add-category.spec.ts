import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddCategory } from './add-category';
import { CategoryService } from '../../categories/category.service';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('AddCategory', () => {
  let component: AddCategory;
  let fixture: ComponentFixture<AddCategory>;
  let categoryService: CategoryService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCategory],
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
          provide: CategoryService,
          useValue: {
            addCategory: () => of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCategory);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService);
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add category successfully', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true as never);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    const updateSpy = vi.spyOn(categoryService, 'addCategory').mockReturnValue(of());
    component.categoryForm.setValue({
      name: 'Electronics',
    });
    component.saveCategory();
    expect(updateSpy).toHaveBeenCalled();
  });
});
