import {
  belongsTo,
  Entity,
  model,
  property,
} from '@loopback/repository';

import {Order} from './order.model';
import {Product} from './product.model';

@model({
  settings: {
    strict: true,
    postgresql: {
      table: 'order_items',
    },
  },
})
export class OrderItem extends Entity {
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
    () => Order,
    {
      name: 'order',
    },
  )
  order_id: number;

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
    type: 'number',
    required: true,
    jsonSchema: {
      minimum: 1,
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

  constructor(data?: Partial<OrderItem>) {
    super(data);
  }
}

export interface OrderItemRelations {
  order?: Order;
  product?: Product;
}

export type OrderItemWithRelations =
  OrderItem & OrderItemRelations;