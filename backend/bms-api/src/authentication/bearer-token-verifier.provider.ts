import {inject, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {VerifyFunction} from 'loopback4-authentication';

import {TokenService} from '../services/token-service';
import {TokenServiceBindings} from '../keys';
import {RevokedTokenRepository} from '@sourceloop/authentication-service';

@injectable()
export class BearerTokenVerifierProvider {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    private tokenService: TokenService,

    @inject('repositories.RevokedTokenRepository')
    private revokedTokenRepository: RevokedTokenRepository,
  ) {}

  value(): VerifyFunction.BearerFn {
    return async token => {

      console.log("Bearer token verifier is called");
      try {
        console.log("verifying jwt");
        const userProfile = await this.tokenService.verifyToken(token);
        console.log("jwt verified successfully");

        const revokedToken = await this.revokedTokenRepository.get(token);
        console.log('Checking token in revoked repository:', token);
        console.log('Revoked token result:', revokedToken);
        if (revokedToken) {
          throw new HttpErrors.Unauthorized('Token has been revoked');
        }

        const authUser = {
          id: userProfile.id,
          username: userProfile.name ?? '',
          role: userProfile.role,
          permissions: userProfile.permissions ?? [],
        };

        return authUser;
      } catch (error) {
        throw new HttpErrors.Unauthorized('Invalid or expired token.');
      }
    };
  }
}
