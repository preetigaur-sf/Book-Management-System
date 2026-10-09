import {Entity, model, property} from '@loopback/repository';
import { table } from 'console';

@model({
  settings:{
    strict:true,
    postgresql:{
      table:'notifications',
    },
  },
})
export class Notification extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  user_id: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  message: string;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  @property({
    type: 'boolean',
    required: true,
    default:false,
  })
  is_read: boolean;

  @property({
    type: 'date',
    required: true,
  })
  created_at:Date;


  constructor(data?: Partial<Notification>) {
    super(data);
  }
}

export interface NotificationRelations {
  // describe navigational properties here
}

export type NotificationWithRelations = Notification & NotificationRelations;
