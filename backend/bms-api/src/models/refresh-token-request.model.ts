import {model, property} from '@loopback/repository';

@model()
export class RefreshTokenRequest {
  @property({
    type: 'string',
    required: true,
  })
  refreshToken: string;
}