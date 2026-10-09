import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Api } from './api';
import { ChatMessage } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private api = inject(Api);

  sendMessage(receiverId: number, message: string): Observable<ChatMessage> {
    console.log('Received from Angular:',receiverId);
    return this.api.post<ChatMessage>('chat/send', {
      receiver_id: receiverId,
      message,
    });
  }

  getConversation(userId: number): Observable<ChatMessage[]> {
    return this.api.get<ChatMessage[]>(`chat/conversation/${userId}`);
  }

  markAsRead(id: number): Observable<void> {
    return this.api.patch<void>(`chat/read/${id}`, {});
  }

  getUsers(): Observable<any[]> {
    return this.api.get<any[]>('chat/users');
  }
}
