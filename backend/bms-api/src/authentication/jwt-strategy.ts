import {inject, injectable} from '@loopback/core';
import {Request, HttpErrors} from '@loopback/rest';

import {AuthenticationStrategy} from '@loopback/authentication';
import {UserProfile} from '@loopback/security';

import {TokenService} from '../services/token-service';
import {TokenServiceBindings} from '../keys';

@injectable()
export class JWTStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    private tokenService: TokenService,
  ) {}

  async authenticate(
    request: Request,
  ): Promise<UserProfile | undefined> {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new HttpErrors.Unauthorized(
        'Authorization header not found.',
      );
    }

    const parts = authHeader.split(' ');

    if (
      parts.length !== 2 ||
      parts[0] !== 'Bearer'
    ) {
      throw new HttpErrors.Unauthorized(
        'Invalid Authorization header.',
      );
    }

    const token = parts[1];

    return this.tokenService.verifyToken(token);
  }
}