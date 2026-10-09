import {RoleRepository} from '../repositories';
import {Roles} from '../authorization/roles';
import {Permissions} from '../authorization/permissions';

export async function seedRoles(roleRepository: RoleRepository): Promise<void> {
  console.log('Seeding Roles...');

  const existingRoles = await roleRepository.count();

  if (existingRoles.count > 0) {
    console.log('Roles Already Exists!');
    return;
  }

  const adminPermissions = Object.values(Permissions);

  const userPermissions = [
    Permissions.ReadProduct,
    Permissions.ReadCategory,
    Permissions.ReadBrand,

    Permissions.CreateOrder,
    Permissions.ReadOrder,

    Permissions.CreateProductReview,
    Permissions.ReadProductReview,
    Permissions.UpdateProductReview,
    Permissions.DeleteProductReview,

    Permissions.CreateWishlist,
    Permissions.ReadWishlist,
    Permissions.DeleteWishlist,

    Permissions.ReadNotification,
    Permissions.UpdateNotification,
    

    Permissions.CreateChat,
    Permissions.ReadChat,
    Permissions.UpdateChat,

    Permissions.CreateCart,
    Permissions.ReadCart,
    Permissions.UpdateCart,
    Permissions.DeleteCart,
  ];

  await roleRepository.createAll([
    {
      name: Roles.ADMIN,
      permissions: adminPermissions,
    },
    {
      name: Roles.USER,
      permissions: userPermissions,
    },
  ]);

  console.log('Roles seeded successfully.');
}
