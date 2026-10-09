import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Cart} from './cart.model';
import {Brand} from './brands.model';
import {Category} from './category.model';
import {Wishlist} from './wishlist.model';
import {ProductReview} from './product-review.model';
import {OrderItem} from './order-item.model';

@model({
  settings: {
    strict: true,
    postgresql: {
      table: 'products',
    },
  },
})
export class Product extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    postgresql: {
      columnName: 'id',
      dataType: 'integer',
    },
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 2,
      maxLength: 255,
    },
    postgresql: {
      columnName: 'name',
      dataType: 'varchar',
      dataLength: 255,
    },
  })
  name: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 5000,
    },
    postgresql: {
      columnName: 'description',
      dataType: 'text',
    },
  })
  description?: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      minimum: 1,
      maximum: 1000000,
    },
    postgresql: {
      columnName: 'price',
      dataType: 'decimal',
      precision: 10,
      scale: 2,
    },
  })
  price: number;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      minimum: 0,
    },
    postgresql: {
      columnName: 'stock_quantity',
      dataType: 'integer',
    },
  })
  stock_quantity: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 3,
      maxLength: 50,
      pattern: '^[A-Z0-9_-]+$',
    },
    postgresql: {
      columnName: 'sku',
      dataType: 'varchar',
      dataLength: 50,
    },
  })
  sku: string;

  @property({
    type: 'string',
    jsonSchema: {
      format: 'uri',
      maxLength: 500,
    },
    postgresql: {
      columnName: 'image_url',
      dataType: 'varchar',
      dataLength: 500,
    },
  })
  image_url?: string;

  @belongsTo(() => Brand, {
    name: 'brand',
  })
  brand_id: number;

  @belongsTo(() => Category, {
    name: 'category',
  })
  category_id: number;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'created_at',
      dataType: 'timestamp',
    },
  })
  created_at?: string;

  @property({
    type: 'date',
    postgresql: {
      columnName: 'updated_at',
      dataType: 'timestamp',
    },
  })
  updated_at?: string;

  @hasMany(() => Wishlist, {
    keyTo: 'product_id',
  })
  wishlists: Wishlist[];

  @hasMany(() => ProductReview, {
    keyTo: 'product_id',
  })
  productReviews: ProductReview[];

  @hasMany(() => Cart, {
    keyTo: 'product_id',
  })
  carts: Cart[];
  @hasMany(() => OrderItem, {
    keyTo: 'product_id',
  })
  orderItems: OrderItem[];

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  brand?: Brand;
  category?: Category;
  wishlists?: Wishlist[];
  productReviews?: ProductReview[];
  carts?: Cart[];
  orderItems?: OrderItem[];
}

export type ProductWithRelations = Product & ProductRelations;
