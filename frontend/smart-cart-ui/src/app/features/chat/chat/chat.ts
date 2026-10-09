import {
  Component,
  OnInit,
  inject,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, switchMap, tap } from 'rxjs';

import { ChatService } from '../../../core/services/chat.service';
import { ChatMessage } from '../../../core/models/chat-message.model';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnInit, AfterViewInit, OnDestroy {
  private auth = inject(Auth);
  private chatService = inject(ChatService);

  currentUserId!: number;
  adminId!: number;

  messages$: Observable<ChatMessage[]> = new Observable();

  message = '';

  private chatObserver!: MutationObserver;

  ngOnInit(): void {
    const token = this.auth.getToken();

    if (!token) {
      return;
    }

    const payload = JSON.parse(
      atob(token.split('.')[1]),
    );

    this.currentUserId = Number(payload.id);

    console.log('Current User ID:', this.currentUserId);

    this.messages$ = this.chatService.getAdmin().pipe(
      tap((admin) => {
        this.adminId = Number(admin.id);

        console.log('Admin ID:', this.adminId);
      }),
      switchMap((admin) =>
        this.chatService.getConversation(
          Number(admin.id),
        ),
      ),
    );
  }

  ngAfterViewInit(): void {
    this.chatScroll();
  }

  handleEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if (event.shiftKey) {
        return;
      }

      event.preventDefault();
      this.sendMessage();
    }
  }

  adjustHeight(event: any): void {
    const textarea = event.target;

    textarea.style.height = 'auto';
    textarea.style.height =
      textarea.scrollHeight + 'px';
  }

  resetHeight(): void {
    const textarea =
      document.querySelector(
        '.card-footer textarea',
      ) as HTMLTextAreaElement;

    if (textarea) {
      textarea.style.height = 'auto';
    }
  }

  sendMessage(): void {
    if (!this.message.trim() || !this.adminId) {
      return;
    }

    this.chatService
      .sendMessage(
        this.message,
        this.adminId,
      )
      .subscribe({
        next: () => {
          this.message = '';

          this.resetHeight();

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

  loadConversation(): void {
    if (!this.adminId) {
      return;
    }

    this.messages$ =
      this.chatService.getConversation(
        this.adminId,
      );
  }

  chatScroll(): void {
    const container =
      document.querySelector('.chat-body');

    if (!container) {
      return;
    }

    this.chatObserver =
      new MutationObserver(() => {
        container.scrollTop =
          container.scrollHeight;
      });

    this.chatObserver.observe(container, {
      childList: true,
      subtree: true,
    });

    container.scrollTop =
      container.scrollHeight;
  }

  ngOnDestroy(): void {
    if (this.chatObserver) {
      this.chatObserver.disconnect();
    }
  }
}