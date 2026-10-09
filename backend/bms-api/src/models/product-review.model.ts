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
      table: 'product_reviews',
    },
  },
})
export class ProductReview extends Entity {
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
    type: 'number',
    required: true,
    jsonSchema: {
      minimum: 1,
      maximum: 5,
    },
    postgresql: {
      columnName: 'rating',
      dataType: 'integer',
    },
  })
  rating: number;

  @property({
    type: 'string',
    jsonSchema: {
      minLength: 2,
      maxLength: 1000,
    },
    postgresql: {
      columnName: 'comment',
      dataType: 'text',
    },
  })
  comment?: string;

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

  constructor(data?: Partial<ProductReview>) {
    super(data);
  }
}

export interface ProductReviewRelations {
  user?: User;
  product?: Product;
}

export type ProductReviewWithRelations =
  ProductReview & ProductReviewRelations;