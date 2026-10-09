import {Getter, inject} from '@loopback/core';

import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';

import {SmartCartDataSource} from '../datasources';

import {
  Cart,
  CartRelations,
  Product,
  User,
} from '../models';

import {ProductRepository} from './product.repository';
import {UserRepository} from './user.repository';

export class CartRepository extends DefaultCrudRepository<
  Cart,
  typeof Cart.prototype.id,
  CartRelations
> {
  public readonly user: BelongsToAccessor<
    User,
    typeof Cart.prototype.id
  >;

  public readonly product: BelongsToAccessor<
    Product,
    typeof Cart.prototype.id
  >;

  constructor(
    @inject('datasources.SmartCartDataSource')
    dataSource: SmartCartDataSource,

    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,

    @repository.getter('ProductRepository')
    protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Cart, dataSource);

    this.user = this.createBelongsToAccessorFor(
      'user',
      userRepositoryGetter,
    );

    this.registerInclusionResolver(
      'user',
      this.user.inclusionResolver,
    );

    this.product = this.createBelongsToAccessorFor(
      'product',
      productRepositoryGetter,
    );

    this.registerInclusionResolver(
      'product',
      this.product.inclusionResolver,
    );
  }
}