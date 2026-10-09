import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Api } from './api';
import { ChatMessage } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private api = inject(Api);

  sendMessage(
    message: string,
    receiverId?: number,
  ): Observable<ChatMessage> {
    const body: {
      message: string;
      receiver_id?: number;
    } = {
      message,
    };

    if (receiverId !== undefined) {
      body.receiver_id = receiverId;
    }

    console.log('Chat request:', body);

    return this.api.post<ChatMessage>(
      'chat/send',
      body,
    );
  }

  getConversation(
    userId: number,
  ): Observable<ChatMessage[]> {
    return this.api.get<ChatMessage[]>(
      `chat/conversation/${userId}`,
    );
  }

  getAdmin(): Observable<any> {
    return this.api.get<any>('chat/admin');
  }

  markAsRead(id: number): Observable<void> {
    return this.api.patch<void>(
      `chat/read/${id}`,
      {},
    );
  }

  getUsers(): Observable<any[]> {
    return this.api.get<any[]>('chat/users');
  }
}