import {inject} from '@loopback/core';
import {
  post,
  requestBody,
  response,
  getModelSchemaRef,
} from '@loopback/rest';

import {User} from '../models';
import {LoginRequest} from '../models/login-request.model';
import {UserService} from '../services/user.service';

export class AuthController {
  constructor(
    @inject('services.UserService')
    private userService: UserService,
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
  ): Promise<{ token: string }> {
    const token = await this.userService.loginUser(loginData);
    return { token };
  }
}