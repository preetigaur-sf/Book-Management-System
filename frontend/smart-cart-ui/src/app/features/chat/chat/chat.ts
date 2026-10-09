import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatService } from '../../../core/services/chat.service';
import { ChatMessage } from '../../../core/models/chat-message.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnInit {

  private chatService = inject(ChatService);

  messages: ChatMessage[] = [];

  message = '';

  ngOnInit(): void {

    this.loadConversation();

    setInterval(() => {
      this.loadConversation();
    }, 5000);
  }

  loadConversation(): void {

    this.chatService.getConversation(9).subscribe({
      next: data => {
        this.messages = data;
      },
      error: err => {
        console.error(err);
      },
    });

  }

  sendMessage(): void {

    if (!this.message.trim()) {
      return;
    }

    this.chatService.sendMessage(9,this.message).subscribe({
      next: () => {

        this.message = '';

        this.loadConversation();

      },
      error: err => {
        console.error(err);
      },
    });

  }

}