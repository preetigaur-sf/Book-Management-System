import {RoleRepository} from '../repositories';
import { Roles } from '../authorization/roles';

export async function seedRoles(
  roleRepository: RoleRepository,
): Promise<void> {

  console.log('Seeding Roles...');

  const existingRoles = await roleRepository.count();

  if (existingRoles.count > 0) {
    console.log('Roles Already Exists!');
    return;
  }

  await roleRepository.createAll([
    {
      role_name: Roles.ADMIN,
    },
    {
      role_name: Roles.USER,
    },
  ]);

  console.log('Roles seeded successfully.');
}

