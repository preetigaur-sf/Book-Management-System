import {
  Component,
  OnInit,
  inject,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { ChatService } from '../../../core/services/chat.service';
import { ChatMessage } from '../../../core/models/chat-message.model';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-admin-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-chat.html',
  styleUrl: './admin-chat.scss',
})
export class AdminChat
  implements OnInit, AfterViewInit, OnDestroy {

  private chatService = inject(ChatService);
  private auth = inject(Auth);

  currentUserId!: number;

  users$: Observable<any[]> = new Observable();
  messages$: Observable<ChatMessage[]> = new Observable();

  selectedUser: any = null;
  message = '';

  private chatObserver!: MutationObserver;

  ngOnInit(): void {
    this.users$ = this.chatService.getUsers();

    const token = this.auth.getToken();

    if (token) {
      const payload = JSON.parse(
        atob(token.split('.')[1]),
      );

      this.currentUserId = Number(payload.id);

      console.log(
        'Admin Current User ID:',
        this.currentUserId,
      );
    }
  }

  ngAfterViewInit(): void {
    this.chatScroll();
  }

  selectUser(user: any): void {
    this.selectedUser = user;

    console.log(
      'Selected User ID:',
      this.selectedUser.id,
    );

    this.loadConversation();
  }

  loadConversation(): void {
    if (!this.selectedUser) {
      return;
    }

    this.messages$ =
      this.chatService.getConversation(
        this.selectedUser.id,
      );
  }

  sendMessage(): void {
    if (
      !this.message.trim() ||
      !this.selectedUser
    ) {
      return;
    }

    this.chatService.sendMessage(
  this.message,
  this.selectedUser.id,
)
      .subscribe({
        next: () => {
          this.message = '';

          this.loadConversation();
        },
        error: (err) => {
          console.error(
            'Send message error:',
            err,
          );
        },
      });
  }

  chatScroll(): void {
    setTimeout(() => {
      const container =
        document.querySelector(
          '.chat-body',
        );

      if (container) {
        this.chatObserver =
          new MutationObserver(() => {
            container.scrollTop =
              container.scrollHeight;
          });

        this.chatObserver.observe(
          container,
          {
            childList: true,
            subtree: true,
          },
        );

        container.scrollTop =
          container.scrollHeight;
      }
    }, 50);
  }

  ngOnDestroy(): void {
    if (this.chatObserver) {
      this.chatObserver.disconnect();
    }
  }
}