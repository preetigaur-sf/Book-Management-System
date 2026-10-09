import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import * as dotenv from 'dotenv';

import {PasswordHasherBindings, TokenServiceBindings} from './keys';
import {BcryptHasher} from './services/bcrypt-hasher';
import {JWTService} from './services/jwt-service';
import {UserService} from './services/user.service';
import {CheckoutFacade} from './facades';
import {
  AuthenticationComponent,
  AuthenticationBindings,
  Strategies,
} from 'loopback4-authentication';
import {BearerTokenVerifierProvider} from './authentication/bearer-token-verifier.provider';
import {registerAuthenticationStrategy} from '@loopback/authentication';

import {
  AuthorizationBindings,
  AuthorizationComponent,
} from 'loopback4-authorization';

import {JWTStrategy} from './authentication/jwt-strategy';
import {ProductReviewService} from './services/product-review.service';
import {WishlistService} from './services';
import {User} from './models';
import {AuthSequence} from './auth-sequence';
import {AuthCacheDataSource} from './datasources/auth-cache.datasource';
import {
  RefreshTokenRepository,
  RevokedTokenRepository,
} from '@sourceloop/authentication-service';
import {RefreshTokenService} from './services/refresh-token.service';

export {ApplicationConfig};

export class BmsApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    dotenv.config();

    //AuthCache datasource
    this.dataSource(AuthCacheDataSource, AuthCacheDataSource.dataSourceName);

    //SourceLoop repositories for Refresh token and Revoked token
    this.bind('repositories.RefreshTokenRepository').toClass(
      RefreshTokenRepository,
    );

    this.bind('repositories.RevokedTokenRepository').toClass(
      RevokedTokenRepository,
    );

    // Set up the custom sequence
    this.sequence(AuthSequence);

    //CORS
    this.configure('rest').to({
      cors: {
        origin: ['http://localhost:4200'],
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // Authentication
    this.bind(AuthenticationBindings.CONFIG).to({
      useUserAuthenticationMiddleware: true,
    });

    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTStrategy);

    this.bind(Strategies.Passport.BEARER_TOKEN_VERIFIER).toProvider(
      BearerTokenVerifierProvider,
    );

    // Authorization configuration
    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });

    // SourceFuse Authorization Component
    this.component(AuthorizationComponent);

    this.api({
      openapi: '3.0.0',
      info: {
        title: 'SmartCart API',
        version: '1.0.0',
      },
      paths: {},
      components: {
        securitySchemes: {
          jwt: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    });

    // Static files
    this.static('/', path.join(__dirname, '../public'));

    // REST Explorer
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });

    // Password Hasher
    this.bind(PasswordHasherBindings.ROUNDS).to(10);

    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    // User Service
    this.bind('services.UserService').toClass(UserService);

    //wishlist service
    this.bind('services.WishlistService').toClass(WishlistService);

    //product review service
    this.bind('services.ProductReviewService').toClass(ProductReviewService);

    this.bind(AuthenticationBindings.USER_MODEL).to(User as any);

    //facade pattern
    this.bind('facades.CheckoutFacade').toClass(CheckoutFacade);

    // JWT(JSON WEB TOKEN)
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(process.env.JWT_SECRET!);

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      process.env.JWT_EXPIRES_IN!,
    );

    //New refresh-token expiry binding
    this.bind(TokenServiceBindings.REFRESH_TOKEN_EXPIRES_IN).to(
      process.env.REFRESH_TOKEN_EXPIRES_IN!,
    );

    //refresh token service binding
    this.bind('services.RefreshTokenService').toClass(RefreshTokenService);

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);

    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;

    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
