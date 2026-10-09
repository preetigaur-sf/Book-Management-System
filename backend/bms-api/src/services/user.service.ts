import {inject} from '@loopback/core';
import {Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';

import {UserRepository} from '../repositories';
import {PasswordHasher} from './password-hasher';
import {TokenService} from './token-service';

import {PasswordHasherBindings, TokenServiceBindings} from '../keys';

import {User} from '../models/user.model';
import {LoginRequest} from '../models/login-request.model';
import {UserProfile, securityId} from '@loopback/security';

export class UserService {
  deleteById(id: number) {
    throw new Error('Method not implemented.');
  }
  replaceById(id: number, user: User) {
    throw new Error('Method not implemented.');
  }
  updateById(id: number, user: User) {
    throw new Error('Method not implemented.');
  }
  findById(id: number, filter: FilterExcludingWhere<User> | undefined): User | PromiseLike<User> {
    throw new Error('Method not implemented.');
  }
  updateAll(user: User, where: Where<User> | undefined): import("@loopback/repository").Count | PromiseLike<import("@loopback/repository").Count> {
    throw new Error('Method not implemented.');
  }
  find(filter: Filter<User> | undefined): User[] | PromiseLike<User[]> {
    throw new Error('Method not implemented.');
  }
  count(where: Where<User> | undefined): import("@loopback/repository").Count | PromiseLike<import("@loopback/repository").Count> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,

    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    private passwordHasher: PasswordHasher,

    @inject(TokenServiceBindings.TOKEN_SERVICE)
    private tokenService: TokenService,
  ) {}

  async registerUser(user: User): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      throw new HttpErrors.Conflict('Email Already Registered');
    }

    user.password = await this.passwordHasher.hashPassword(user.password);
    user.role_id=2;

    return this.userRepository.create(user);
  }
  async loginUser(loginData: LoginRequest): Promise<string> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginData.email,
      },
      include:[
        {
          relation:'role',
        }
      ]
    });

    if (!user) {
      throw new HttpErrors.Unauthorized('Invalid Email or Password');
    }

    const passwordMatched = await this.passwordHasher.comparePassword(
      loginData.password,
      user.password,
    );

    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Invalid Email or Password');
    }

    const userProfile: UserProfile = {
      [securityId]: user.id!.toString(),
      id: user.id!.toString(),
      name: user.email,
      role:user.role?.role_name,
    };

    const token = await this.tokenService.generateToken(userProfile);

    return token;
  }
}
