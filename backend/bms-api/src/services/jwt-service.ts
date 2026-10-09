import {inject} from '@loopback/core';
import * as jwt from 'jsonwebtoken';
import {UserProfile} from '@loopback/security';
import {TokenService} from './token-service';
import {TokenServiceBindings} from '../keys';

export class JWTService implements TokenService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,

    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
  ) {}

  async generateToken(userProfile:UserProfile): Promise<string> {
    return jwt.sign(userProfile, this.jwtSecret, {
      expiresIn: Number(this.jwtExpiresIn),
    });
  }

  async verifyToken(token: string): Promise<UserProfile> {
    return jwt.verify(token, this.jwtSecret) as UserProfile;
  }
}
