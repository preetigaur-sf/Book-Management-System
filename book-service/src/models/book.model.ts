import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Author} from './author.model';
import {Category} from './category.model';

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
    jsonSchema: {
      minLength: 2,
      maxLength: 100,
    },
  })
  title: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 10,
      maxLength: 13,
      pattern: '^[0-9]{10,13}$',
    },
  })
  isbn: string;

  @property({
    type: 'date',
    required: false,
    default: () => new Date(),
  })
  publication_date: Date;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      minimum: 1,
    },
  })
  price: number;

  @belongsTo(() => Author)
  authorId: number;

  @belongsTo(() => Category)
  categoryId: number;

  constructor(data?: Partial<Book>) {
    super(data);
  }
}

export interface BookRelations {
  // navigational properties will be added by LoopBack
}

export type BookWithRelations = Book & BookRelations;
