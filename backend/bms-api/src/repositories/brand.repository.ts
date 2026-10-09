import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';

import {SmartCartDataSource} from '../datasources';

import {
  Brand,
  BrandRelations,
  Product,
} from '../models';

import {ProductRepository} from './product.repository';

export class BrandRepository extends DefaultCrudRepository<
  Brand,
  typeof Brand.prototype.id,
  BrandRelations
> {
  public readonly products: HasManyRepositoryFactory<
    Product,
    typeof Brand.prototype.id
  >;

  constructor(
    @inject('datasources.SmartCartDataSource')
    dataSource: SmartCartDataSource,

    @repository.getter('ProductRepository')
    protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Brand, dataSource);

    this.products = this.createHasManyRepositoryFactoryFor(
      'products',
      productRepositoryGetter,
    );

    this.registerInclusionResolver(
      'products',
      this.products.inclusionResolver,
    );
  }
}