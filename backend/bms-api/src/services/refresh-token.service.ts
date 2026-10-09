import {inject} from '@loopback/core';
import {RefreshTokenRepository} from '@sourceloop/authentication-service';
import crypto from 'crypto';
import {TokenServiceBindings} from '../keys';

export class RefreshTokenService {
  millisecond: number = 1000;
  constructor(
    @inject('repositories.RefreshTokenRepository')
    private refreshTokenRepository: RefreshTokenRepository,

    @inject(TokenServiceBindings.REFRESH_TOKEN_EXPIRES_IN)
    private refreshTokenExpiresIn: string,
  ) {}

  async generateRefreshToken(): Promise<string> {
    const size = 32;
    const refreshToken: string = crypto.randomBytes(size).toString('hex');
    return refreshToken;
  }

  async saveRefreshToken(
    refreshToken: string,
    userId: string,
    username: string,
    accessToken: string,
  ): Promise<void> {
    await this.refreshTokenRepository.set(
      refreshToken,
      {
        userId,
        username,
        accessToken,
      },
      {
        ttl: Number(this.refreshTokenExpiresIn) * this.millisecond,
      },
    );
  }

  async getRefreshToken(refreshToken: string) {
    const refreshTokenData = await this.refreshTokenRepository.get(refreshToken);
    return refreshTokenData;
  }

  async deleteRefreshToken(refreshToken:string):Promise<void>{
    await this.refreshTokenRepository.delete(refreshToken);
  }
}
