import { Component, OnInit, inject, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { ChatService } from '../../../core/services/chat.service';
import { ChatMessage } from '../../../core/models/chat-message.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnInit, AfterViewInit, OnDestroy {
  private chatService = inject(ChatService);

  messages$: Observable<ChatMessage[]> = new Observable();
  message = '';
  private chatObserver!: MutationObserver;

  ngOnInit(): void {
    this.loadConversation();
  }

  ngAfterViewInit(): void {
    this.chatScroll();
  }

  loadConversation(): void {
    this.messages$ = this.chatService.getConversation(9);
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
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  resetHeight(): void {
    const textarea = document.querySelector('.card-footer textarea') as HTMLTextAreaElement;
    if (textarea) {
      textarea.style.height = 'auto';
    }
  }

  sendMessage(): void {
    if (!this.message.trim()) {
      return;
    }

    this.chatService.sendMessage(9, this.message).subscribe({
      next: () => {
        this.message = '';
        this.resetHeight();
        this.loadConversation();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  chatScroll(): void {
    
      const container = document.querySelector('.chat-body');
      if (container) {
        this.chatObserver = new MutationObserver(() => {
          container.scrollTop = container.scrollHeight;
        });

        this.chatObserver.observe(container, { childList: true });
        container.scrollTop = container.scrollHeight;
      }
   
  }

  ngOnDestroy(): void {
    if (this.chatObserver) {
      this.chatObserver.disconnect();
    }
  }
}
