import {
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';

import { Product } from './product.model';

@model({
  settings: {
    strict: true,
    postgresql: {
      table: 'categories',
    },
  },
})
export class Category extends Entity {
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
      maxLength: 100,
      pattern: '^[A-Za-z ]+$',
    },
    postgresql: {
      columnName: 'name',
      dataType: 'varchar',
      dataLength: 100,
    },
  })
  name: string;

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

  @hasMany(() => Product,{
    keyTo:'category_id',
  })
  products: Product[];

  constructor(data?: Partial<Category>) {
    super(data);
  }
}

export interface CategoryRelations {
  products?: Product[];
}

export type CategoryWithRelations = Category & CategoryRelations;