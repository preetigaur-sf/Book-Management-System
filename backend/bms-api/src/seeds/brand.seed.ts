import {BrandRepository} from '../repositories';

export async function seedBrands(
  brandRepository: BrandRepository,
): Promise<void> {
  console.log('Seeding Brands...');

  const existingBrands = await brandRepository.count();

  if (existingBrands.count > 0) {
    console.log('Brands already exist.');
    return;
  }
  await brandRepository.createAll([
    {name: 'Apple'},
    {name: 'Samsung'},
    {name: 'Sony'},
    {name: 'Dell'},
    {name: 'HP'},
    {name: 'Lenovo'},
    {name: 'Boat'},
    {name: 'Nike'},
    {name: 'Adidas'},
    {name: 'Puma'},

    {name: 'Canon'},
    {name: 'LG'},
    {name: 'Microsoft'},
    {name: 'Logitech'},
    {name: 'American Tourister'},
    {name: 'Tanishq'},
    {name: 'Titan'},
    {name: 'Fastrack'},
    {name: 'Nivea'},
    {name: 'Dove'},

    {name: 'Fogg'},
    {name: 'Classmate'},
    {name: 'Prestige'},
    {name: 'Philips'},
    {name: 'Coca-Cola'},
    {name: 'Lay’s'},
    {name: 'Amul'},
    {name: 'Johnson'},
    {name: 'Pedigree'},
    {name: 'Bosch'},

    {name: 'Steelbird'},
    {name: 'Funskool'},
    {name: 'Yamaha'},
    {name: 'Safari'},
    {name: 'Fresh'},
    {name: 'Generic'},
    {name: 'Levis'},
    {name: 'Allen Solly'},
    {name: 'Peter England'},
    {name: 'Van Heusen'},

    {name: 'Lakme'},
    {name: 'Mamaearth'},
    {name: 'Himalaya'},
    {name: 'LOréal'},
    {name: 'Maybelline'},
    {name: 'Ponds'},
  ]);

  console.log('Brands Seeded Successfully.');
}
