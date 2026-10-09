import {injectable} from '@loopback/core';
import {AuthenticationStrategy} from '@loopback/authentication';
import {Request} from '@loopback/rest';
import * as jwt from 'jsonwebtoken';

@injectable()
export class JWTAuthenticationStrategy
  implements AuthenticationStrategy {

  name = 'jwt';

  async authenticate(request: Request): Promise<any> {

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new Error('Authorization header missing');
    }

    const token = authHeader.replace('Bearer ', '');

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET || 'G1@2u3r4',
    );

    return {
      id: decoded.id,
      email: decoded.email,
       role: decoded.role,
    };
  }
}