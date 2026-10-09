import {faker} from '@faker-js/faker';

import {
  ProductReviewRepository,
  ProductRepository,
  UserRepository,
} from '../repositories';

export async function seedReviews(
  reviewRepository: ProductReviewRepository,
  productRepository: ProductRepository,
  userRepository: UserRepository,
): Promise<void> {
  console.log('Seeding Product Reviews...');

  const existingReviews = await reviewRepository.count();

  if (existingReviews.count > 0) {
    console.log('Product Reviews already exist.');
    return;
  }

  const users = await userRepository.find();
  const products = await productRepository.find();

  if (users.length === 0 || products.length === 0) {
    throw new Error(
      'Please seed users and products before seeding reviews.',
    );
  }

  const usedPairs = new Set<string>();

  for (const product of products) {
    const reviewCount = faker.number.int({
      min: 1,
      max: Math.min(5, users.length),
    });

    const selectedUsers = faker.helpers.arrayElements(
      users,
      reviewCount,
    );

    for (const user of selectedUsers) {
      const key = `${user.id}-${product.id}`;

      if (usedPairs.has(key)) {
        continue;
      }

      usedPairs.add(key);

      await reviewRepository.create({
        user_id: user.id!,
        product_id: product.id!,
        rating: faker.number.int({
          min: 1,
          max: 5,
        }),
        comment: faker.lorem.sentence(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }

  console.log('Product Reviews Seeded Successfully.');
}