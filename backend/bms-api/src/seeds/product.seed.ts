import {faker} from '@faker-js/faker';
import {Product} from '../models';
import {DataObject} from '@loopback/repository';
import { productPriceMap } from './product-price-map';
import {
  ProductRepository,
  BrandRepository,
  CategoryRepository,
} from '../repositories';
import { productImageMap } from './product-image-map';
import {brandCategoryMap} from './brand-category-map';
import {
  mobileProducts,
  laptopProducts,
  tabletProducts,
  smartWatchProducts,
  headphoneProducts,
  cameraProducts,
  bookProducts,
  beautyProducts,
  sportsProducts,
  furnitureProducts,
  groceryProducts,
  televisionProducts,
  gamingProducts,
  computerAccessoryProducts,
  mobileAccessoryProducts,
  menClothingProducts,
  womenClothingProducts,
  kidsClothingProducts,
  footwearProducts,
  bagProducts,
  jewelleryProducts,
  watchProducts,
  personalCareProducts,
  perfumeProducts,
  stationeryProducts,
  officeSupplyProducts,
  smartHomeProducts,
  travelAccessoryProducts,
  giftProducts,
  musicalInstrumentProducts,
  toyProducts,
  gardenProducts,
  toolProducts,
  carAccessoryProducts,
  bikeAccessoryProducts,
  automotiveProducts,
  fitnessProducts,
  healthCareProducts,
  petProducts,
  babyCareProducts,
  dairyProducts,
  snackProducts,
  beverageProducts,
  fruitProducts,
  cleaningSupplyProducts,
  kitchenApplianceProducts,
  homeApplianceProducts,
  lightingProducts,
  storageProducts
} from './product-data';

const productCategoryMap: {[key: string]: string[]} = {
  Mobiles: mobileProducts,
  Laptops: laptopProducts,
  Tablets: tabletProducts,
  'Smart Watches': smartWatchProducts,
  Headphones: headphoneProducts,
  Cameras: cameraProducts,
  Books: bookProducts,
  Beauty: beautyProducts,
  Sports: sportsProducts,
  Furniture: furnitureProducts,
  'Home Appliances': homeApplianceProducts,
  Groceries: groceryProducts,
  Televisions: televisionProducts,
  Gaming: gamingProducts,
  'Computer Accessories': computerAccessoryProducts,
  'Mobile Accessories': mobileAccessoryProducts,
  'Men Clothing': menClothingProducts,
  'Women Clothing': womenClothingProducts,
  'Kids Clothing': kidsClothingProducts,
  Footwear: footwearProducts,
  Bags: bagProducts,
  Jewellery: jewelleryProducts,
  Watches: watchProducts,
  'Personal Care': personalCareProducts,
  Perfumes: perfumeProducts,
  Stationery: stationeryProducts,
  'Office Supplies': officeSupplyProducts,
  'Kitchen Appliances': kitchenApplianceProducts,
  Lighting: lightingProducts,
  Storage: storageProducts,
  'Cleaning Supplies': cleaningSupplyProducts,
  'Fruits & Vegetables': fruitProducts,
  Beverages: beverageProducts,
  Snacks: snackProducts,
  'Dairy Products': dairyProducts,
  'Baby Care': babyCareProducts,
  'Pet Supplies': petProducts,
  'Health Care': healthCareProducts,
  Fitness: fitnessProducts,

  Automotive: automotiveProducts,
  'Bike Accessories': bikeAccessoryProducts,
  'Car Accessories': carAccessoryProducts,
  Tools: toolProducts,
  Garden: gardenProducts,
  Toys: toyProducts,
  'Musical Instruments': musicalInstrumentProducts,
  'Gift Items': giftProducts,
  'Travel Accessories': travelAccessoryProducts,
  'Smart Home': smartHomeProducts,
};
export async function seedProducts(
  productRepository: ProductRepository,
  brandRepository: BrandRepository,
  categoryRepository: CategoryRepository,
): Promise<void> {
  console.log('Seeding Products...');

  const existingProducts = await productRepository.count();

  if (existingProducts.count > 0) {
    console.log('Products already exist.');
    return;
  }

  const brands = await brandRepository.find();
  const categories = await categoryRepository.find();
  const availableCategories = categories.filter(category => {
    return productCategoryMap[category.name];
  });
  if (brands.length === 0 || categories.length === 0) {
    throw new Error(
      'Please seed brands and categories before seeding products.',
    );
  }

  const products: DataObject<Product>[] = [];
  for (const category of availableCategories) {

  const productList = productCategoryMap[category.name];

  for (let i = 1; i <= 30; i++) {

    const brandNames = brandCategoryMap[category.name];

    let brand =
      brands[Math.floor(Math.random() * brands.length)];

    if (brandNames) {

      const randomBrandName =
        brandNames[Math.floor(Math.random() * brandNames.length)];

      const matchedBrand = brands.find(
        brand => brand.name === randomBrandName,
      );

      if (matchedBrand) {
        brand = matchedBrand;
      }
    }

    const priceRange = productPriceMap[category.name];

    let productName = faker.commerce.productName();

    if (productList) {
      productName =
        productList[Math.floor(Math.random() * productList.length)];
    }

    products.push({
      name: productName,

      description: faker.commerce.productDescription(),

      price: Number(
        faker.commerce.price({
          min: priceRange?.min ?? 500,
          max: priceRange?.max ?? 50000,
          dec: 2,
        }),
      ),

      stock_quantity: faker.number.int({
        min: 10,
        max: 200,
      }),

      sku: `SKU-${category.id}-${i}-${faker.string.alphanumeric(4).toUpperCase()}`,

      image_url: productImageMap[productName] ?? faker.image.url(),

      brand_id: brand.id!,

      category_id: category.id!,

      created_at: new Date().toISOString(),

      updated_at: new Date().toISOString(),
    });

  }

}

  await productRepository.createAll(products);

  console.log('Products Seeded Successfully.');
}
