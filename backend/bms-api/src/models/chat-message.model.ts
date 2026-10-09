import {Entity, model, property} from '@loopback/repository';

@model({
  settings:{
    strict:true,
    postgresql:{
      table:'chat_messages',
    },
  },
})
export class ChatMessage extends Entity {
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
  sender_id: number;

  @property({
    type: 'number',
    required: true,
  })
  receiver_id: number;

  @property({
    type: 'string',
    required: true,
  })
  message: string;

  @property({
    type: 'boolean',
    required: true,
  })
  is_read: boolean;

  @property({
    type: 'date',
    required: true,
  })
  created_at: Date;


  constructor(data?: Partial<ChatMessage>) {
    super(data);
  }
}

export interface ChatMessageRelations {
  // describe navigational properties here
}

export type ChatMessageWithRelations = ChatMessage & ChatMessageRelations;
