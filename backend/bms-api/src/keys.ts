import {BindingKey} from '@loopback/core';
import {PasswordHasher} from './services/password-hasher';
import {TokenService} from './services/token-service';

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>(
    'services.passwordHasher',
  );

  export const ROUNDS = BindingKey.create<number>(
    'services.passwordHasher.rounds',
  );
}

export namespace TokenServiceBindings {
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.jwt.service',
  );

  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );

  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in',
  );
}