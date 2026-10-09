import {Getter, inject} from '@loopback/core';

import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';

import {SmartCartDataSource} from '../datasources';

import {
  Product,
  ProductReview,
  ProductReviewRelations,
  User,
} from '../models';

import {ProductRepository} from './product.repository';
import {UserRepository} from './user.repository';

export class ProductReviewRepository extends DefaultCrudRepository<
  ProductReview,
  typeof ProductReview.prototype.id,
  ProductReviewRelations
> {
  public readonly user: BelongsToAccessor<
    User,
    typeof ProductReview.prototype.id
  >;

  public readonly product: BelongsToAccessor<
    Product,
    typeof ProductReview.prototype.id
  >;

  constructor(
    @inject('datasources.SmartCartDataSource')
    dataSource: SmartCartDataSource,

    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,

    @repository.getter('ProductRepository')
    protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(ProductReview, dataSource);

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