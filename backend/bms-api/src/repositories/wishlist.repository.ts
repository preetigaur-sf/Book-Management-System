import {Getter, inject} from '@loopback/core';

import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';

import {SmartCartDataSource} from '../datasources';

import {
  Product,
  User,
  Wishlist,
  WishlistRelations,
} from '../models';

import {ProductRepository} from './product.repository';
import {UserRepository} from './user.repository';

export class WishlistRepository extends DefaultCrudRepository<
  Wishlist,
  typeof Wishlist.prototype.id,
  WishlistRelations
> {
  public readonly user: BelongsToAccessor<
    User,
    typeof Wishlist.prototype.id
  >;

  public readonly product: BelongsToAccessor<
    Product,
    typeof Wishlist.prototype.id
  >;

  constructor(
    @inject('datasources.SmartCartDataSource')
    dataSource: SmartCartDataSource,

    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,

    @repository.getter('ProductRepository')
    protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Wishlist, dataSource);

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