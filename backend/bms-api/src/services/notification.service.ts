import {injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';

import {NotificationRepository} from '../repositories';
import {Notification} from '../models';

@injectable()
export class NotificationServiceService {
  constructor(
    @repository(NotificationRepository)
    public notificationRepository: NotificationRepository,

  ) {}

  async createNotification(
    userId: number,
    title: string,
    message: string,
    type: string,
  ) {
    const notification = await this.notificationRepository.create({
      user_id: userId,
      title,
      message,
      type,
      is_read: false,
      created_at: new Date(),
    });
    return notification;
  }
  
}
