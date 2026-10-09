import {
  Entity,
  belongsTo,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Cart} from './cart.model';
import {Role} from './role.model';
import {Order} from './order.model';
import {ProductReview} from './product-review.model';
import {Wishlist} from './wishlist.model';

@model({
  settings: {
    strict: true,
    postgresql: {
      table: 'users',
    },
  },
})
export class User extends Entity {
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
      maxLength: 50,
      pattern: '^[A-Za-z ]+$',
    },
    postgresql: {
      columnName: 'first_name',
      dataType: 'varchar',
      dataLength: 50,
    },
  })
  first_name: string;

  @property({
    type: 'string',
    jsonSchema: {
      minLength: 2,
      maxLength: 50,
      pattern: '^[A-Za-z ]*$',
    },
    postgresql: {
      columnName: 'last_name',
      dataType: 'varchar',
      dataLength: 50,
    },
  })
  last_name?: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      format: 'email',
      maxLength: 255,
    },
    postgresql: {
      columnName: 'email',
      dataType: 'varchar',
      dataLength: 255,
    },
  })
  email: string;

  @property({
    type: 'string',
    jsonSchema: {
      minLength: 8,
      maxLength: 255,
    },
    postgresql: {
      columnName: 'password',
      dataType: 'varchar',
      dataLength: 255,
    },
  })
  password: string;

  @belongsTo(() => Role, {
    name: 'role',
  })
  role_id: number;

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
    keyTo: 'user_id',
  })
  wishlists: Wishlist[];

  @hasMany(() => ProductReview, {
    keyTo: 'user_id',
  })
  productReviews: ProductReview[];

  @hasMany(() => Cart, {
    keyTo: 'user_id',
  })
  carts: Cart[];

  @hasMany(() => Order, {
    keyTo: 'user_id',
  })
  orders: Order[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  role?: Role;
  productReviews?: ProductReview[];
  wishlists?: Wishlist[];
  carts?: Cart[];
  orders?:Order[];
}

export type UserWithRelations = User & UserRelations;
