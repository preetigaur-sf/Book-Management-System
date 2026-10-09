import {inject} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'AuthCache',
  connector: 'kv-redis',
  url: process.env.REDIS_URL,
};

export class AuthCacheDataSource extends juggler.DataSource {
  static dataSourceName = 'AuthCache';

  constructor(
    @inject('datasources.config.AuthCache', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}