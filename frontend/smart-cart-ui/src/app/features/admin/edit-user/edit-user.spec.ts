import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditUser } from './edit-user';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from '../../user/user';
import { of } from 'rxjs';
import { User } from '../../../core/models/user';

describe('EditUser', () => {
  let component: EditUser;
  let fixture: ComponentFixture<EditUser>;
  let userService: UserService;
  const mockUser: User = {
    id: 1,
    first_name: 'Preeti',
    last_name: 'Gaur',
    email: 'preeti@test.com',
    password: '123456',
    role_id: 1,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUser],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
          },
        },

        {
          provide: UserService,
          useValue: {
            getUserById: () => of({}),
            updateUser: () => of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditUser);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    vi.spyOn(userService, 'getUserById').mockReturnValue(of(mockUser));
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user on init', () => {
    expect(userService.getUserById).toHaveBeenCalledWith(1);
    expect(component.userForm.value.first_name).toBe(mockUser.first_name);
    expect(component.userForm.value.email).toBe(mockUser.email);
  });

  it('should update user successfully',()=>{
    const router = TestBed.inject(Router);
    vi.spyOn(router,'navigate').mockResolvedValue(true as never);
    vi.spyOn(window,'alert').mockImplementation(()=>{});
    const updateSpy = vi.spyOn(userService,'updateUser').mockReturnValue(of(void 0));
    component.userForm.setValue({
      first_name:'Preeti',
      last_name:'Gaur',
      email:'preeti@test.com',
      password:'123456',
      role_id:1,
    });
    component.updateUser();
    expect(updateSpy).toHaveBeenCalled();
  });
});
