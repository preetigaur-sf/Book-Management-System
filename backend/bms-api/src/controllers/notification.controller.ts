import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Notification} from '../models';
import {NotificationRepository} from '../repositories';
import {authenticate, STRATEGY, AuthenticationBindings} from 'loopback4-authentication';
import {inject} from '@loopback/core';
import {UserProfile} from '@loopback/security';
import {authorize} from 'loopback4-authorization';
import {Permissions} from '../authorization/permissions';
export class NotificationController {
  constructor(
    @repository(NotificationRepository)
    public notificationRepository: NotificationRepository,
  ) {}
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.CreateNotification],
  })
  @post('/notifications')
  @response(200, {
    description: 'Notification model instance',
    content: {'application/json': {schema: getModelSchemaRef(Notification)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notification, {
            title: 'NewNotification',
            exclude: ['id'],
          }),
        },
      },
    })
    notification: Omit<Notification, 'id'>,
  ): Promise<Notification> {
    return this.notificationRepository.create(notification);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadNotification],
  })
  @get('/notifications/count')
  @response(200, {
    description: 'Notification model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Notification) where?: Where<Notification>,
  ): Promise<Count> {
    return this.notificationRepository.count(where);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadNotification],
  })
  @get('/notifications')
  @response(200, {
    description: 'Array of Notification model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Notification, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Notification) filter?: Filter<Notification>,
  ): Promise<Notification[]> {
    return this.notificationRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadNotification],
  })
  @get('/notifications/my')
  @response(200, {
    description: 'Current user notifications',
  })
  async getMyNotifications(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile,
  ): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: {
        user_id: Number(currentUser.id),
      },
      order: ['created_at DESC'],
    });
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateNotification],
  })
  @patch('/notifications')
  @response(200, {
    description: 'Notification PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notification, {partial: true}),
        },
      },
    })
    notification: Notification,
    @param.where(Notification) where?: Where<Notification>,
  ): Promise<Count> {
    return this.notificationRepository.updateAll(notification, where);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.ReadNotification],
  })
  @get('/notifications/{id}')
  @response(200, {
    description: 'Notification model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Notification, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Notification, {exclude: 'where'})
    filter?: FilterExcludingWhere<Notification>,
  ): Promise<Notification> {
    return this.notificationRepository.findById(id, filter);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateNotification],
  })
  @patch('/notifications/{id}')
  @response(204, {
    description: 'Notification PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Notification, {partial: true}),
        },
      },
    })
    notification: Notification,
  ): Promise<void> {
    await this.notificationRepository.updateById(id, notification);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateNotification],
  })
  @patch('/notifications/{id}/read')
  @response(204, {
    description: 'Notification marked as read',
  })
  async markAsRead(@param.path.number('id') id: number): Promise<void> {
    await this.notificationRepository.updateById(id, {
      is_read: true,
    });
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.UpdateNotification],
  })
  @put('/notifications/{id}')
  @response(204, {
    description: 'Notification PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() notification: Notification,
  ): Promise<void> {
    await this.notificationRepository.replaceById(id, notification);
  }
  @authenticate(STRATEGY.BEARER)
  @authorize({
    permissions: [Permissions.DeleteNotification],
  })
  @del('/notifications/{id}')
  @response(204, {
    description: 'Notification DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.notificationRepository.deleteById(id);
  }
}
