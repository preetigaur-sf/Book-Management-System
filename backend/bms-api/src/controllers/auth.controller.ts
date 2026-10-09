import {inject} from '@loopback/core';
import {
  post,
  requestBody,
  response,
  getModelSchemaRef,
  param,
  HttpErrors,
} from '@loopback/rest';
import {authorize} from 'loopback4-authorization';
import {RefreshTokenRequest, User} from '../models';
import {LoginRequest} from '../models/login-request.model';
import {UserService} from '../services/user.service';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {
  RefreshTokenRepository,
  RevokedTokenRepository,
} from '@sourceloop/authentication-service';

export class AuthController {
  constructor(
    @inject('services.UserService')
    private userService: UserService,

    @inject('repositories.RefreshTokenRepository')
    private refreshTokenRepository: RefreshTokenRepository,

    @inject('repositories.RevokedTokenRepository')
    private revokedTokenRepository: RevokedTokenRepository,
  ) {}

  @post('/register')
  @response(200, {
    description: 'Register User',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User),
      },
    },
  })
  async register(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'RegisterUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.userService.registerUser(user as User);
  }

  @post('/login')
  @response(200, {
    description: 'JWT Token',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
            },
            refreshToken: {
              type: 'string',
            },
            role: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LoginRequest),
        },
      },
    })
    loginData: LoginRequest,
  ): Promise<{token: string; refreshToken: string; role: string}> {
    console.log("Successfully logged in");
    return this.userService.loginUser(loginData);
  }

  @post('/token-refresh')
  @response(200, {
    description: 'Refresh Access Token',
  })
  async refreshToken(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RefreshTokenRequest),
        },
      },
    })
    refreshTokenRequest: RefreshTokenRequest,
  ) {
    console.log('TOKEN REFRESH CONTROLLER HIT');

    return this.userService.refreshAccessToken(
      refreshTokenRequest.refreshToken,
    );
  }

  @authenticate(STRATEGY.BEARER, {
    passReqToCallback: true,
  })
  @authorize({permissions: ['*']})
  @post('/logout')
  @response(200, {
    description: 'Logout successful',
  })
  async logout(
    @param.header.string('Authorization')
    authorization: string,

    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RefreshTokenRequest),
        },
      },
    })
    refreshTokenRequest: RefreshTokenRequest,
  ) {
    const token = authorization?.replace(/bearer /i, '');

    if (!token || !refreshTokenRequest.refreshToken) {
      throw new HttpErrors.UnprocessableEntity(
        'Access token or refresh token is missing',
      );
    }

    const refreshTokenData = await this.refreshTokenRepository.get(
      refreshTokenRequest.refreshToken,
    );

    if (!refreshTokenData) {
      throw new HttpErrors.Unauthorized('Invalid or expired refresh token');
    }

    if (refreshTokenData.accessToken !== token) {
      throw new HttpErrors.Unauthorized(
        'Access token and refresh token do not match',
      );
    }

    await this.revokedTokenRepository.set(token, {
      token,
    });

    await this.refreshTokenRepository.delete(refreshTokenRequest.refreshToken);

    console.log("Logout successfully");
    return {
      success: true,
    };
  }
}
