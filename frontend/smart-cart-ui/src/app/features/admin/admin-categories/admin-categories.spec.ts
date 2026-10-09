import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCategories } from './admin-categories';
import { provideRouter, ActivatedRoute, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { CategoryService } from '../../categories/category.service';
import { Category } from '../../../core/models/category';
import { of } from 'rxjs';
describe('AdminCategories', () => {
  let component: AdminCategories;
  let fixture: ComponentFixture<AdminCategories>;
  let categoryService: CategoryService;
  const mockcategory: Category[] = [
    {
      id: 1,
      name: 'Mobile',
    },
  ];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCategories],
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
          provide: CategoryService,
          usevalue: {
            getCategories: () => of([]),
            deletecategory: () => of(void 0),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminCategories);
    component = fixture.componentInstance;
    categoryService = TestBed.inject(CategoryService);
    vi.spyOn(categoryService, 'getCategories').mockReturnValue(of(mockcategory));
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load category on init', () => {
    const router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true as never);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    expect(categoryService.getCategories).toHaveBeenCalled();
    expect(component.categories).toEqual(mockcategory);
  });
});
