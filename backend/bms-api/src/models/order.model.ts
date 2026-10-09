import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';

import {User} from './user.model';
import {OrderItem} from './order-item.model';

@model({
  settings: {
    strict: true,
    postgresql: {
      table: 'orders',
    },
  },
})
export class Order extends Entity {
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

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      minimum: 1,
    },
    postgresql: {
      columnName: 'total_amount',
      dataType: 'decimal',
      precision: 10,
      scale: 2,
    },
  })
  total_amount: number;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: [
        'PENDING',
        'PLACED',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
      ],
    },
    postgresql: {
      columnName: 'order_status',
      dataType: 'varchar',
      dataLength: 30,
    },
  })
  order_status: string;

  @property({
    type: 'date',
    required: true,
    postgresql: {
      columnName: 'order_date',
      dataType: 'timestamp',
    },
  })
  order_date: string;

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

  @hasMany(() => OrderItem, {
    keyTo: 'order_id',
  })
  orderItems: OrderItem[];

  constructor(data?: Partial<Order>) {
    super(data);
  }
}

export interface OrderRelations {
  user?: User;
  orderItems?: OrderItem[];
}

export type OrderWithRelations = Order & OrderRelations;