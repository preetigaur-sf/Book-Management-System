import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUsers } from './admin-users';
import { of } from 'rxjs';
import { UserService } from '../../user/user';
import { User } from '../../../core/models/user';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('AdminUsers', () => {
  let component: AdminUsers;
  let fixture: ComponentFixture<AdminUsers>;
  let userService: UserService;
  const mockUsers: User[] = [
    {
      id: 1,
      first_name: 'Preeti',
      last_name: 'Gaur',
      email: 'preetigaur@test.com',
      password: '123456',
      role_id: 1,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUsers],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1',
              },
            },
            params: {
              subscribe: () => {},
            },
          },
        },
        {
          provide: UserService,
          useValue: {
            getUsers: () => of([]),
            deleteUser: () => of(void 0),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUsers);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    vi.spyOn(userService, 'getUsers').mockReturnValue(of(mockUsers));
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  });

  it('should delete user and reload users', () => {
    const router = TestBed.inject(Router);

    vi.spyOn(router, 'navigate').mockResolvedValue(true as never);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const deleteSpy = vi.spyOn(userService, 'deleteUser').mockReturnValue(of(void 0));
    const loadSpy = vi.spyOn(component, 'loadUsers');
    component.deleteUser(1);
    expect(deleteSpy).toHaveBeenCalledWith(1);
    expect(loadSpy).toHaveBeenCalled();
  });

  it('should not delete user if user cancels', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const deleteSpy = vi.spyOn(userService, 'deleteUser');
    component.deleteUser(1);
    expect(deleteSpy).not.toHaveBeenCalled();
  });
});
