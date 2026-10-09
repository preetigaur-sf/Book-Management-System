import {faker} from '@faker-js/faker';

import {
  WishlistRepository,
  ProductRepository,
  UserRepository,
} from '../repositories';

export async function seedWishlist(
  wishlistRepository: WishlistRepository,
  productRepository: ProductRepository,
  userRepository: UserRepository,
): Promise<void> {
  console.log('Seeding Wishlist...');

  const existingWishlist = await wishlistRepository.count();

  if (existingWishlist.count > 0) {
    console.log('Wishlist already exists.');
    return;
  }

  const users = await userRepository.find();
  const products = await productRepository.find();

  if (users.length === 0 || products.length === 0) {
    throw new Error(
      'Please seed users and products before seeding wishlist.',
    );
  }

  const usedPairs = new Set<string>();

  for (const user of users) {
    const wishlistCount = faker.number.int({
      min: 2,
      max: Math.min(8, products.length),
    });

    const selectedProducts = faker.helpers.arrayElements(
      products,
      wishlistCount,
    );

    for (const product of selectedProducts) {
      const key = `${user.id}-${product.id}`;

      if (usedPairs.has(key)) {
        continue;
      }

      usedPairs.add(key);

      await wishlistRepository.create({
        user_id: user.id!,
        product_id: product.id!,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }

  console.log('Wishlist Seeded Successfully.');
}