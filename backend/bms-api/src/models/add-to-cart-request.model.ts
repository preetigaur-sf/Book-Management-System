import {model, property} from '@loopback/repository';

@model()
export class AddToCartRequest {
  @property({
    type: 'number',
    required: true,
  })
  product_id: number;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      minimum: 1,
    },
  })
  quantity: number;
}