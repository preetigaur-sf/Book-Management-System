import {injectable} from '@loopback/core';
import {repository} from '@loopback/repository';

import {ChatMessageRepository} from '../repositories';
import {ChatMessage} from '../models';

@injectable()
export class ChatService {
  constructor(
    @repository(ChatMessageRepository)
    public chatRepository: ChatMessageRepository,
  ) {}

  async sendMessage(
    senderId: number,
    receiverId: number,
    message: string,
  ): Promise<ChatMessage> {
    console.log({senderId,receiverId,message,});
    return this.chatRepository.create({
      sender_id: senderId,
      receiver_id: receiverId,
      message,
      is_read: false,
      created_at: Date(),
    });
  }

  async getConversation(
    senderId: number,
    receiverId: number,
  ): Promise<ChatMessage[]> {
    return this.chatRepository.find({
      where: {
        or: [
          {
            and: [
              {sender_id: senderId},
              {receiver_id: receiverId},
            ],
          },
          {
            and: [
              {sender_id: receiverId},
              {receiver_id: senderId},
            ],
          },
        ],
      },
      order: ['created_at ASC'],
    });
  }

  async markAsRead(id: number): Promise<void> {
    await this.chatRepository.updateById(id, {
      is_read: true,
    });
  }
}