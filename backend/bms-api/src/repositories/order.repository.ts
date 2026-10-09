import {Getter, inject} from '@loopback/core';

import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';

import {SmartCartDataSource} from '../datasources';

import {
  Order,
  OrderItem,
  OrderRelations,
  User,
} from '../models';

import {OrderItemRepository} from './order-item.repository';
import {UserRepository} from './user.repository';

export class OrderRepository extends DefaultCrudRepository<
  Order,
  typeof Order.prototype.id,
  OrderRelations
> {
  public readonly user: BelongsToAccessor<
    User,
    typeof Order.prototype.id
  >;

  public readonly orderItems: HasManyRepositoryFactory<
    OrderItem,
    typeof Order.prototype.id
  >;

  constructor(
    @inject('datasources.SmartCartDataSource')
    dataSource: SmartCartDataSource,

    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,

    @repository.getter('OrderItemRepository')
    protected orderItemRepositoryGetter: Getter<OrderItemRepository>,
  ) {
    super(Order, dataSource);

    this.user = this.createBelongsToAccessorFor(
      'user',
      userRepositoryGetter,
    );

    this.registerInclusionResolver(
      'user',
      this.user.inclusionResolver,
    );

    this.orderItems = this.createHasManyRepositoryFactoryFor(
      'orderItems',
      orderItemRepositoryGetter,
    );

    this.registerInclusionResolver(
      'orderItems',
      this.orderItems.inclusionResolver,
    );
  }
}