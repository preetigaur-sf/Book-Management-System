import {Entity, model, property} from '@loopback/repository';

@model()
export class Book extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  author: string;

  @property({
    type: 'string',
    required: true,
  })
  isbn: string;

  @property({
    type: 'date',
    required: true,
  })
  publicationDate: Date;

  @property({
    type: 'string',
    required: true,
  })
  category: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema:{
      minimum:0,
    }
  })
  price: number;

  constructor(data?: Partial<Book>) {
    super(data);
  }
}

export interface BookRelations {
  // describe navigational properties here
}

export type BookWithRelations = Book & BookRelations;
