import {Getter, inject} from '@loopback/core';

import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';

import {SmartCartDataSource} from '../datasources';

import {
  Order,
  OrderItem,
  OrderItemRelations,
  Product,
} from '../models';

import {OrderRepository} from './order.repository';
import {ProductRepository} from './product.repository';

export class OrderItemRepository extends DefaultCrudRepository<
  OrderItem,
  typeof OrderItem.prototype.id,
  OrderItemRelations
> {
  public readonly order: BelongsToAccessor<
    Order,
    typeof OrderItem.prototype.id
  >;

  public readonly product: BelongsToAccessor<
    Product,
    typeof OrderItem.prototype.id
  >;

  constructor(
    @inject('datasources.SmartCartDataSource')
    dataSource: SmartCartDataSource,

    @repository.getter('OrderRepository')
    protected orderRepositoryGetter: Getter<OrderRepository>,

    @repository.getter('ProductRepository')
    protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(OrderItem, dataSource);

    this.order = this.createBelongsToAccessorFor(
      'order',
      orderRepositoryGetter,
    );

    this.registerInclusionResolver(
      'order',
      this.order.inclusionResolver,
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