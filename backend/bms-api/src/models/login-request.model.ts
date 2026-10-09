import {model, property} from '@loopback/repository';

@model()
export class LoginRequest {
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      format: 'email',
    },
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;
}