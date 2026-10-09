import {inject, service} from '@loopback/core';
import {
  authenticate,
  STRATEGY,
  AuthenticationBindings,
} from 'loopback4-authentication';
import {UserProfile} from '@loopback/security';
import {authorize} from 'loopback4-authorization';
import {Permissions} from '../authorization/permissions';
import {
  post,
  get,
  patch,
  requestBody,
  response,
  param,
  HttpErrors,
} from '@loopback/rest';
import {repository} from '@loopback/repository';

import {UserRepository} from '../repositories';
import {ChatService} from '../services';

export class ChatController {
  constructor(
    @service(ChatService)
    public chatService: ChatService,

    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.CreateChat],
  })
  @post('/chat/send')
  @response(200, {
    description: 'Send Chat Messages',
  })
  async sendMessage(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,

    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['message'],
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
      receiver_id?: number;
      message: string;
    },
  ): Promise<any> {
    const currentUserId = Number(currentUser.id);

    const roleName =
      typeof currentUser.role === 'string'
        ? currentUser.role
        : currentUser.role?.name;

    console.log('Current User ID:', currentUserId);
    console.log('Current User Role:', currentUser.role);

    let receiverId: number;

    if (roleName === 'USER') {
      const admin = await this.userRepository.findOne({
        where: {
          role_id: 1,
        },
        fields: {
          id: true,
        },
      });

      if (!admin) {
        throw new HttpErrors.NotFound('Admin user not found');
      }

      receiverId = Number(admin.id);
    } else if (roleName === 'ADMIN') {
      if (!body.receiver_id) {
        throw new HttpErrors.BadRequest(
          'receiver_id is required for admin',
        );
      }

      receiverId = Number(body.receiver_id);

      const user = await this.userRepository.findOne({
        where: {
          id: receiverId,
          role_id: 2,
        },
        fields: {
          id: true,
        },
      });

      if (!user) {
        throw new HttpErrors.NotFound('Selected user not found');
      }
    } else {
      throw new HttpErrors.Forbidden('Invalid user role');
    }

    console.log('Receiver ID:', receiverId);

    return this.chatService.sendMessage(
      currentUserId,
      receiverId,
      body.message,
    );
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadChat],
  })
  @get('/chat/admin')
  @response(200, {
    description: 'Get admin user',
  })
  async getAdmin(): Promise<any> {
    const admin = await this.userRepository.findOne({
      where: {
        role_id: 1,
      },
      fields: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    });

    if (!admin) {
      throw new HttpErrors.NotFound('Admin user not found');
    }

    return admin;
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadChat],
  })
  @get('/chat/users')
  @response(200, {
    description: 'Get all users for admin chat',
  })
  async getUsers(): Promise<any[]> {
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

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadChat],
  })
  @get('/chat/conversation/{userId}')
  @response(200, {
    description: 'Conversation',
  })
  async getConversation(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,

    @param.path.number('userId')
    userId: number,
  ): Promise<any> {
    const currentUserId = Number(currentUser.id);

    const roleName =
      typeof currentUser.role === 'string'
        ? currentUser.role
        : currentUser.role?.name;

    console.log('Current User ID:', currentUserId);
    console.log('Current User Role:', currentUser.role);

    let receiverId: number;

    if (roleName === 'USER') {
      const admin = await this.userRepository.findOne({
        where: {
          role_id: 1,
        },
        fields: {
          id: true,
        },
      });

      if (!admin) {
        throw new HttpErrors.NotFound('Admin user not found');
      }

      receiverId = Number(admin.id);
    } else if (roleName === 'ADMIN') {
      receiverId = Number(userId);

      const user = await this.userRepository.findOne({
        where: {
          id: receiverId,
          role_id: 2,
        },
        fields: {
          id: true,
        },
      });

      if (!user) {
        throw new HttpErrors.NotFound('Selected user not found');
      }
    } else {
      throw new HttpErrors.Forbidden('Invalid user role');
    }

    console.log('Conversation Receiver ID:', receiverId);

    return this.chatService.getConversation(
      currentUserId,
      receiverId,
    );
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateChat],
  })
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