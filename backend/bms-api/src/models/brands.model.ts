import {
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';

import {Product} from './product.model';

@model({
  settings: {
    strict: true,
    postgresql: {
      table: 'brands',
    },
  },
})
export class Brand extends Entity {
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
      maxLength: 150,
      pattern: '^[A-Za-z0-9 .&-]+$',
    },
    postgresql: {
      columnName: 'name',
      dataType: 'varchar',
      dataLength: 150,
    },
  })
  name: string;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 2000,
    },
    postgresql: {
      columnName: 'description',
      dataType: 'text',
    },
  })
  description?: string;

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

  @hasMany(() => Product, {
    keyTo: 'brand_id',
  })
  products: Product[];

  constructor(data?: Partial<Brand>) {
    super(data);
  }
}

export interface BrandRelations {
  products?: Product[];
}

export type BrandWithRelations = Brand & BrandRelations;