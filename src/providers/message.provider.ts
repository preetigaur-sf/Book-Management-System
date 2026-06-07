import {Provider} from '@loopback/core';

export interface MessageService {
  getMessage(): string;
}

export class MessageProvider implements Provider<MessageService> {
  value(): MessageService {
    return {
      getMessage: () => {
        return 'Book added successfully using Provider Pattern';
      },
    };
  }
}
