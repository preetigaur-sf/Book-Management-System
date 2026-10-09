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
import {MySequence} from './sequence';
import {PasswordHasherBindings, TokenServiceBindings} from './keys';
import {BcryptHasher} from './services/bcrypt-hasher';
import {JWTService} from './services/jwt-service';
import {UserService} from './services/user.service';
import {CheckoutFacade} from './facades';
import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';

import {
  AuthorizationBindings,
  AuthorizationComponent,
  AuthorizationTags,
} from '@loopback/authorization';

import { AuthorizationProvider } from './authorization/authorization-provider';

import {JWTStrategy} from './authentication/jwt-strategy';
import { ProductReviewService } from './services/product-review.service';
import { WishlistService } from './services';

export {ApplicationConfig};

export class BmsApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    dotenv.config();
    // Set up the custom sequence
    this.sequence(MySequence);

    // Authentication
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTStrategy);

    // Authorization Component
    this.component(AuthorizationComponent);
    
    // authorizationProvider 
    this.bind('authorizationProvider.default')
      .toProvider(AuthorizationProvider)
      .tag(AuthorizationTags.AUTHORIZER);
    
      
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

    //facade pattern
    this.bind('facades.CheckoutFacade').toClass(CheckoutFacade);
    // JWT
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(process.env.JWT_SECRET!);

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      process.env.JWT_EXPIRES_IN!,
    );

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
