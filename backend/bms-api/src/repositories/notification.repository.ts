import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SmartCartDataSource} from '../datasources';
import {Notification, NotificationRelations} from '../models';

export class NotificationRepository extends DefaultCrudRepository<
  Notification,
  typeof Notification.prototype.id,
  NotificationRelations
> {
  constructor(
    @inject('datasources.SmartCartDataSource') dataSource: SmartCartDataSource,
  ) {
    super(Notification, dataSource);
  }
}
