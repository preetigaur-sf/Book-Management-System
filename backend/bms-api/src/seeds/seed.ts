import {BmsApiApplication} from '../application';

import {
  RoleRepository,
  UserRepository,
  CategoryRepository,
  BrandRepository,
  ProductRepository,
  OrderRepository,
  ProductReviewRepository,
  WishlistRepository,
  OrderItemRepository,
} from '../repositories';

import {PasswordHasherBindings} from '../keys';
import {PasswordHasher} from '../services/password-hasher';

import {seedRoles} from './role.seed';
import {seedUsers} from './user.seed';
import {seedCategories} from './category.seed'
import { seedBrands } from './brand.seed';
import { seedProducts } from './product.seed';
import { seedOrders } from './order.seed';
import { seedReviews } from './product-review.seed';
import { seedWishlist } from './wishlist.seed';

async function seed() {
  const app = new BmsApiApplication();

  await app.boot();
  console.log(
  'Controllers:',
  app.find('controllers.*').map(b => b.key),
);

console.log(
  'Repositories:',
  app.find('repositories.*').map(b => b.key),
);

console.log(
  'Datasources:',
  app.find('datasources.*').map(b => b.key),
);
  await app.start();

  console.log('Database Seeding Started...');

  const roleRepository = await app.getRepository(RoleRepository);

  const userRepository = await app.getRepository(UserRepository);

  const categoryRepository = await app.getRepository(CategoryRepository);

  const brandRepository = await app.getRepository(BrandRepository);

  const productRepository = await app.getRepository(ProductRepository);

  const orderRepository = await app.getRepository(OrderRepository);

  const orderItemRepository = await app.getRepository(OrderItemRepository);

  const reviewRepository = await app.getRepository(ProductReviewRepository);

  const wishlistRepository = await app.getRepository(WishlistRepository);

  const passwordHasher = await app.get<PasswordHasher>(
    PasswordHasherBindings.PASSWORD_HASHER,
  );

  await seedRoles(roleRepository);

  await seedUsers(userRepository, roleRepository, passwordHasher);

  await seedCategories(categoryRepository);
  await seedBrands(brandRepository);
  await seedProducts(productRepository,brandRepository,categoryRepository);
  await seedOrders(orderRepository,orderItemRepository,userRepository,productRepository);
  await seedReviews(reviewRepository,productRepository,userRepository);
  await seedWishlist(wishlistRepository,productRepository,userRepository);

  console.log('Database Seeding Completed.');

  process.exit(0);
}

seed().catch(error => {
  console.error('Seeding Failed');
  console.error(error);

  process.exit(1);
});
