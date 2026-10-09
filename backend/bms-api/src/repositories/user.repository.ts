import {Getter, inject} from '@loopback/core';

import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';

import {SmartCartDataSource} from '../datasources';

import {
  Cart,
  ProductReview,
  Role,
  User,
  UserRelations,
  Wishlist,
} from '../models';

import {CartRepository} from './cart.repository';
import {ProductReviewRepository} from './product-review.repository';
import {RoleRepository} from './role.repository';
import {WishlistRepository} from './wishlist.repository';
import {Order} from '../models';
import {OrderRepository} from './order.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly role: BelongsToAccessor<Role, typeof User.prototype.id>;

  public readonly productReviews: HasManyRepositoryFactory<
    ProductReview,
    typeof User.prototype.id
  >;

  public readonly wishlists: HasManyRepositoryFactory<
    Wishlist,
    typeof User.prototype.id
  >;

  public readonly carts: HasManyRepositoryFactory<
    Cart,
    typeof User.prototype.id
  >;

  public readonly orders: HasManyRepositoryFactory<
    Order,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.SmartCartDataSource')
    dataSource: SmartCartDataSource,

    @repository.getter('RoleRepository')
    protected roleRepositoryGetter: Getter<RoleRepository>,

    @repository.getter('ProductReviewRepository')
    protected productReviewRepositoryGetter: Getter<ProductReviewRepository>,

    @repository.getter('WishlistRepository')
    protected wishlistRepositoryGetter: Getter<WishlistRepository>,

    @repository.getter('CartRepository')
    protected cartRepositoryGetter: Getter<CartRepository>,

    @repository.getter('OrderRepository')
    protected orderRepositoryGetter: Getter<OrderRepository>,
  ) {
    super(User, dataSource);

    this.role = this.createBelongsToAccessorFor('role', roleRepositoryGetter);

    this.registerInclusionResolver('role', this.role.inclusionResolver);

    this.productReviews = this.createHasManyRepositoryFactoryFor(
      'productReviews',
      productReviewRepositoryGetter,
    );

    this.registerInclusionResolver(
      'productReviews',
      this.productReviews.inclusionResolver,
    );

    this.wishlists = this.createHasManyRepositoryFactoryFor(
      'wishlists',
      wishlistRepositoryGetter,
    );

    this.registerInclusionResolver(
      'wishlists',
      this.wishlists.inclusionResolver,
    );

    this.carts = this.createHasManyRepositoryFactoryFor(
      'carts',
      cartRepositoryGetter,
    );

    this.registerInclusionResolver('carts', this.carts.inclusionResolver);

    this.orders = this.createHasManyRepositoryFactoryFor(
      'orders',
      orderRepositoryGetter,
    );

    this.registerInclusionResolver('orders', this.orders.inclusionResolver);
  }
}
