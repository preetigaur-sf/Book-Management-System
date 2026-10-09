import {faker} from '@faker-js/faker';

import {
  OrderRepository,
  OrderItemRepository,
  ProductRepository,
  UserRepository,
} from '../repositories';

export async function seedOrders(
  orderRepository: OrderRepository,
  orderItemRepository: OrderItemRepository,
  userRepository: UserRepository,
  productRepository: ProductRepository,
): Promise<void> {
  console.log('Seeding Orders...');

  const existingOrders = await orderRepository.count();

  if (existingOrders.count > 0) {
    console.log('Orders already exist.');
    return;
  }

  const users = await userRepository.find();

  const products = await productRepository.find();

  if (users.length === 0 || products.length === 0) {
    throw new Error(
      'Please seed users and products before seeding orders.',
    );
  }

  for (const user of users) {
    const orderCount = faker.number.int({
      min: 1,
      max: 3,
    });

    for (let i = 0; i < orderCount; i++) {
      const selectedProducts = faker.helpers.arrayElements(
        products,
        faker.number.int({
          min: 1,
          max: 4,
        }),
      );

      let totalAmount = 0;

      for (const product of selectedProducts) {
        const quantity = faker.number.int({
          min: 1,
          max: 3,
        });

        totalAmount += Number(product.price) * quantity;
      }

      const order = await orderRepository.create({
        user_id: user.id!,

        total_amount: totalAmount,

        order_status: faker.helpers.arrayElement([
          'PENDING',
          'PLACED',
          'SHIPPED',
          'DELIVERED',
        ]),

        order_date: new Date().toISOString(),

        created_at: new Date().toISOString(),

        updated_at: new Date().toISOString(),
      });

      for (const product of selectedProducts) {
        const quantity = faker.number.int({
          min: 1,
          max: 3,
        });

        await orderItemRepository.create({
          order_id: order.id!,
          product_id: product.id!,
          quantity,
          price: product.price,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }
  }

  console.log('Orders Seeded Successfully.');
}