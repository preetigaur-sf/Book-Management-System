import {
  belongsTo,
  Entity,
  model,
  property,
} from '@loopback/repository';

import {Product} from './product.model';
import {User} from './user.model';

@model({
  settings: {
    strict: true,
    postgresql: {
      table: 'carts',
    },
  },
})
export class Cart extends Entity {
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

  @belongsTo(
    () => User,
    {
      name: 'user',
    },
  )
  user_id: number;

  @belongsTo(
    () => Product,
    {
      name: 'product',
    },
  )
  product_id: number;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      minimum: 1,
    },
    postgresql: {
      columnName: 'quantity',
      dataType: 'integer',
    },
  })
  quantity: number;

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

  constructor(data?: Partial<Cart>) {
    super(data);
  }
}

export interface CartRelations {
  user?: User;
  product?: Product;
}

export type CartWithRelations = Cart & CartRelations;