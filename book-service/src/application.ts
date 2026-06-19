import 'dotenv/config';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';

import {RestApplication} from '@loopback/rest';

import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';

import {RepositoryMixin} from '@loopback/repository';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';

import {MySequence} from './sequence';
import {DbDataSource} from './datasources';
import {AuthenticationComponent} from '@loopback/authentication';

import {registerAuthenticationStrategy} from '@loopback/authentication';

import {JWTAuthenticationStrategy} from './authentication-strategies/jwt.strategy';

export {ApplicationConfig};

export class BookServiceApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Sequence
    this.sequence(MySequence);

    // Static files
    this.static('/', path.join(__dirname, '../public'));

    // Explorer
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;

    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };

    this.dataSource(DbDataSource);

    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);
  }

  start = async () => {
    await this.migrateSchema({
      existingSchema: 'alter',
    });

    await super.start();
  };
}
