import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';

import {SmartCartDataSource} from '../datasources';
import {Cart} from '../models';
import {CartRepository} from './cart.repository';
import {
  Brand,
  Category,
  Product,
  ProductRelations,
  ProductReview,
  Wishlist,
} from '../models';

import {BrandRepository} from './brand.repository';
import {CategoryRepository} from './category.repository';
import {ProductReviewRepository} from './product-review.repository';
import {WishlistRepository} from './wishlist.repository';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {
  public readonly brand: BelongsToAccessor<Brand, typeof Product.prototype.id>;

  public readonly category: BelongsToAccessor<
    Category,
    typeof Product.prototype.id
  >;

  public readonly productReviews: HasManyRepositoryFactory<
    ProductReview,
    typeof Product.prototype.id
  >;

  public readonly wishlists: HasManyRepositoryFactory<
    Wishlist,
    typeof Product.prototype.id
  >;

  public readonly carts: HasManyRepositoryFactory<
    Cart,
    typeof Product.prototype.id
  >;

  constructor(
    @inject('datasources.SmartCartDataSource')
    dataSource: SmartCartDataSource,

    @repository.getter('BrandRepository')
    protected brandRepositoryGetter: Getter<BrandRepository>,

    @repository.getter('CategoryRepository')
    protected categoryRepositoryGetter: Getter<CategoryRepository>,

    @repository.getter('ProductReviewRepository')
    protected productReviewRepositoryGetter: Getter<ProductReviewRepository>,

    @repository.getter('WishlistRepository')
    protected wishlistRepositoryGetter: Getter<WishlistRepository>,

    @repository.getter('CartRepository')
    protected cartRepositoryGetter: Getter<CartRepository>,
  ) {
    super(Product, dataSource);

    this.brand = this.createBelongsToAccessorFor(
      'brand',
      brandRepositoryGetter,
    );

    this.registerInclusionResolver('brand', this.brand.inclusionResolver);

    this.category = this.createBelongsToAccessorFor(
      'category',
      categoryRepositoryGetter,
    );

    this.registerInclusionResolver('category', this.category.inclusionResolver);

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
  }
}
