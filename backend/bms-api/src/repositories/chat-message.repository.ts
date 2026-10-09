import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SmartCartDataSource} from '../datasources';
import {ChatMessage, ChatMessageRelations} from '../models';

export class ChatMessageRepository extends DefaultCrudRepository<
  ChatMessage,
  typeof ChatMessage.prototype.id,
  ChatMessageRelations
> {
  constructor(
    @inject('datasources.SmartCartDataSource') dataSource: SmartCartDataSource,
  ) {
    super(ChatMessage, dataSource);
  }
}
