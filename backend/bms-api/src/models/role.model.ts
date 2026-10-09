import {Entity, hasMany, model, property} from '@loopback/repository';
import { Permissions } from 'loopback4-authorization';
import {User} from './user.model';

@model({
  settings: {
    strict: true,
    postgresql: {
      table: 'roles',
    },
  },
})
export class Role extends Entity implements Permissions<string> {
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

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 2,
      maxLength: 50,
      pattern: '^[A-Z_]+$',
    },
    postgresql: {
      columnName: 'name',
      dataType: 'varchar',
      dataLength: 50,
    },
  })
  name: string;

  @property({
  type: 'array',
  itemType: 'string',
})
permissions: string[];

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

  @hasMany(() => User, {
    keyTo: 'role_id',
  })
  users?: User[];

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

export interface RoleRelations {
  users?: User[];
}

export type RoleWithRelations = Role & RoleRelations;
