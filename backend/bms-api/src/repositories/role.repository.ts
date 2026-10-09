import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';

import {SmartCartDataSource} from '../datasources';
import {Role, RoleRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.id,
  RoleRelations
> {
  public readonly users: HasManyRepositoryFactory<
    User,
    typeof Role.prototype.id
  >;

  constructor(
    @inject('datasources.SmartCartDataSource')
    dataSource: SmartCartDataSource,

    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Role, dataSource);

    this.users = this.createHasManyRepositoryFactoryFor(
      'users',
      userRepositoryGetter,
    );

    this.registerInclusionResolver(
      'users',
      this.users.inclusionResolver,
    );
  }
}