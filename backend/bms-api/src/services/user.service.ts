import {inject} from '@loopback/core';
import {
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';

import {UserRepository} from '../repositories';
import {PasswordHasher} from './password-hasher';
import {TokenService} from './token-service';

import {PasswordHasherBindings, TokenServiceBindings} from '../keys';

import {User} from '../models/user.model';
import {LoginRequest} from '../models/login-request.model';
import {UserProfile, securityId} from '@loopback/security';

import {RefreshTokenService} from './refresh-token.service';
import {RevokedTokenRepository} from '@sourceloop/authentication-service';

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
  findById(
    id: number,
    filter: FilterExcludingWhere<User> | undefined,
  ): User | PromiseLike<User> {
    throw new Error('Method not implemented.');
  }
  updateAll(
    user: User,
    where: Where<User> | undefined,
  ):
    | import('@loopback/repository').Count
    | PromiseLike<import('@loopback/repository').Count> {
    throw new Error('Method not implemented.');
  }
  find(filter: Filter<User> | undefined): User[] | PromiseLike<User[]> {
    throw new Error('Method not implemented.');
  }
  count(
    where: Where<User> | undefined,
  ):
    | import('@loopback/repository').Count
    | PromiseLike<import('@loopback/repository').Count> {
    throw new Error('Method not implemented.');
  }
  constructor(
    @repository(UserRepository)
    private userRepository: UserRepository,

    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    private passwordHasher: PasswordHasher,

    @inject(TokenServiceBindings.TOKEN_SERVICE)
    private tokenService: TokenService,

    @inject('services.RefreshTokenService')
    private refreshTokenService: RefreshTokenService,

    @inject('repositories.RevokedTokenRepository')
    private revokedTokenRepository: RevokedTokenRepository,
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
    user.role_id = 2;

    return this.userRepository.create(user);
  }
  async loginUser(
    loginData: LoginRequest,
  ): Promise<{token: string; refreshToken: string; role: string}> {
    const user = await this.userRepository.findOne({
      where: {
        email: loginData.email,
      },
      include: [
        {
          relation: 'role',
        },
      ],
    });
    console.log('Logged in user role:', user?.role);
    if (!user) {
      console.log('invalid email');
      throw new HttpErrors.Unauthorized('Invalid Email or Password');
    }

    const passwordMatched = await this.passwordHasher.comparePassword(
      loginData.password,
      user.password,
    );

    if (!passwordMatched) {
      console.log('invalid password');
      throw new HttpErrors.Unauthorized('Invalid Email or Password');
    }

    const userProfile: UserProfile = {
      [securityId]: user.id!.toString(),
      id: user.id!.toString(),
      name: user.email,
      role: user.role,
      permissions: user.role?.permissions ?? [],
    };

    const token = await this.tokenService.generateToken(userProfile);

    const refreshToken = await this.refreshTokenService.generateRefreshToken();

    await this.refreshTokenService.saveRefreshToken(
      refreshToken,
      user.id!.toString(),
      user.email,
      token,
    );

    return {token, refreshToken, role: user.role?.name ?? ''};
  }

  async refreshAccessToken(refreshToken: string) {
    console.log('Refresh token received:', refreshToken);

    const refreshTokenData =
      await this.refreshTokenService.getRefreshToken(refreshToken);
    console.log('Refresh Token Data:', refreshTokenData);
    if (!refreshTokenData) {
      throw new HttpErrors.Unauthorized('Invalid or expired refresh token');
    }

    console.log('Refresh Token Data', refreshTokenData);

    await this.revokedTokenRepository.set(refreshTokenData.accessToken, {
      token: refreshTokenData.accessToken,
    });

    console.log('Old access token revoked:', refreshTokenData.accessToken);

    const user = await this.userRepository.findById(
      Number(refreshTokenData.userId),
      {
        include: [
          {
            relation: 'role',
          },
        ],
      },
    );

    console.log('User found for refresh:', user);

    const userProfile: UserProfile = {
      [securityId]: user.id!.toString(),
      id: user.id!.toString(),
      name: user.email,
      role: user.role,
      permissions: user.role?.permissions ?? [],
    };

    console.log('Refresh User Profile:', userProfile);

    const newAccessToken = await this.tokenService.generateToken(userProfile);

    console.log('New Access Token Generated:', newAccessToken);

    const newRefreshToken =
      await this.refreshTokenService.generateRefreshToken();

    console.log('New Refresh Token Generated:', newRefreshToken);

    await this.refreshTokenService.saveRefreshToken(
      newRefreshToken,
      user.id!.toString(),
      user.email,
      newAccessToken,
    );
    await this.refreshTokenService.deleteRefreshToken(refreshToken);

    return {
      token: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
