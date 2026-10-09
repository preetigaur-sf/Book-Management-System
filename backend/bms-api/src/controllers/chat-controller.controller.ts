import {inject, service} from '@loopback/core';
import {authenticate} from '@loopback/authentication';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {post, get, patch, requestBody, response, param} from '@loopback/rest';
import {repository, Repository} from '@loopback/repository';
import {UserRepository} from '../repositories';
import {ChatService} from '../services';

export class ChatController {
  constructor(
    @service(ChatService)
    public chatService: ChatService,
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @authenticate('jwt')
  @post('/chat/send')
  @response(200, {
    description: 'Send Chat Message',
  })
  async sendMessage(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,

    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['receiver_id', 'message'],
            properties: {
              receiver_id: {
                type: 'number',
              },
              message: {
                type: 'string',
              },
            },
          },
        },
      },
    })
    body: {
      receiver_id: number;
      message: string;
    },
  ) {
    console.log('Current User ID:', currentUser.id);
    console.log('Current User Role:', currentUser.role);
    console.log('Receiver ID:', body.receiver_id);
    return this.chatService.sendMessage(
      Number(currentUser.id),
      body.receiver_id,
      body.message,
    );
  }

  @authenticate('jwt')
  @get('/chat/users')
  @response(200, {
    description: 'Get all users for admin chat',
  })
  async getUsers() {
    return this.userRepository.find({
      where: {
        role_id: 2,
      },
      fields: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
      order: ['first_name ASC'],
    });
  }

  @authenticate('jwt')
  @get('/chat/conversation/{userId}')
  @response(200, {
    description: 'Conversation',
  })
  async getConversation(
    @inject(SecurityBindings.USER)
    currentUser: UserProfile,

    @param.path.number('userId')
    userId: number,
  ) {
    return this.chatService.getConversation(Number(currentUser.id), userId);
  }

  @authenticate('jwt')
  @patch('/chat/read/{id}')
  @response(200, {
    description: 'Mark message as read',
  })
  async markAsRead(
    @param.path.number('id')
    id: number,
  ) {
    await this.chatService.markAsRead(id);

    return {
      message: 'Message marked as read',
    };
  }
}
