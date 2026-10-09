import {model, property} from '@loopback/repository';

@model()
export class UpdateCartRequest {
  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      minimum: 1,
    },
  })
  quantity: number;
}