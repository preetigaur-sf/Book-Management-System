import {faker} from '@faker-js/faker';

import {RoleRepository, UserRepository} from '../repositories';

import {PasswordHasher} from '../services/password-hasher';

export async function seedUsers(
  userRepository: UserRepository,
  roleRepository: RoleRepository,
  passwordHasher: PasswordHasher,
): Promise<void> {
  console.log('Seeding Users...');
  const existingUsers = await userRepository.count();

  if (existingUsers.count > 0) {

    console.log('Users already exist.');

    return;

  }
  const adminRole = await roleRepository.findOne({
    where: {
      role_name: 'ADMIN',
    },
  });

  const userRole = await roleRepository.findOne({
    where: {
      role_name: 'USER',
    },
  });

  if (!adminRole || !userRole) {

    throw new Error(
      'Please seed roles before seeding users.',
    );

  }
  const adminPassword = await passwordHasher.hashPassword(
    'Admin@123',
  );
  await userRepository.create({
    first_name: 'Admin',
    last_name: 'SmartCart',
    email: 'admin@smartcart.com',
    password: adminPassword,
    role_id: adminRole.id!,
  });

  console.log('Admin User Seeded Successfully.');
}