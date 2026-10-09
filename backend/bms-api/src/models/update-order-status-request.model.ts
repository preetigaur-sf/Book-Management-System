import {model, property} from '@loopback/repository';

@model()
export class UpdateOrderStatusRequest {

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: [
        'PLACED',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
      ],
    },
  })
  order_status: string;
}