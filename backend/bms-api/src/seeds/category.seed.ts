import {CategoryRepository} from '../repositories';

export async function seedCategories(
  categoryRepository: CategoryRepository,
): Promise<void> {
  console.log('Seeding Categories...');

  const existingCategories = await categoryRepository.count();

  if (existingCategories.count > 0) {
    console.log('Categories already exist.');
    return;
  }

  await categoryRepository.createAll([
    {name: 'Mobiles'},
    {name: 'Laptops'},
    {name: 'Tablets'},
    {name: 'Smart Watches'},
    {name: 'Headphones'},
    {name: 'Cameras'},
    {name: 'Televisions'},
    {name: 'Gaming'},
    {name: 'Computer Accessories'},
    {name: 'Mobile Accessories'},

    {name: 'Men Clothing'},
    {name: 'Women Clothing'},
    {name: 'Kids Clothing'},
    {name: 'Footwear'},
    {name: 'Bags'},
    {name: 'Jewellery'},
    {name: 'Watches'},
    {name: 'Beauty'},
    {name: 'Personal Care'},
    {name: 'Perfumes'},

    {name: 'Books'},
    {name: 'Stationery'},
    {name: 'Office Supplies'},
    {name: 'Home Decor'},
    {name: 'Furniture'},
    {name: 'Kitchen Appliances'},
    {name: 'Home Appliances'},
    {name: 'Lighting'},
    {name: 'Storage'},
    {name: 'Cleaning Supplies'},

    {name: 'Groceries'},
    {name: 'Fruits & Vegetables'},
    {name: 'Beverages'},
    {name: 'Snacks'},
    {name: 'Dairy Products'},
    {name: 'Baby Care'},
    {name: 'Pet Supplies'},
    {name: 'Health Care'},
    {name: 'Sports'},
    {name: 'Fitness'},

    {name: 'Automotive'},
    {name: 'Bike Accessories'},
    {name: 'Car Accessories'},
    {name: 'Tools'},
    {name: 'Garden'},
    {name: 'Toys'},
    {name: 'Musical Instruments'},
    {name: 'Gift Items'},
    {name: 'Travel Accessories'},
    {name: 'Smart Home'},
  ]);
  console.log('Categories Seeded Successfully.');
}
