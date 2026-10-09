import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatService } from '../../../core/services/chat.service';
import { ChatMessage } from '../../../core/models/chat-message.model';

@Component({
  selector: 'app-admin-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-chat.html',
  styleUrl: './admin-chat.scss',
})
export class AdminChat implements OnInit {

  private chatService = inject(ChatService);

  users: any[] = [];

  messages: ChatMessage[] = [];

  selectedUser: any = null;

  message = '';

  ngOnInit(): void {

    this.loadUsers();

    setInterval(() => {

      if (this.selectedUser) {
        this.loadConversation();
      }

    }, 5000);

  }

  loadUsers(): void {

    this.chatService.getUsers().subscribe({
      next: data => {
        this.users = data;
      },
      error: err => {
        console.error(err);
      },
    });

  }

  selectUser(user: any): void {

    this.selectedUser = user;

    this.loadConversation();

  }

  loadConversation(): void {

    if (!this.selectedUser) {
      return;
    }

    this.chatService.getConversation(this.selectedUser.id).subscribe({
      next: data => {
        this.messages = data;
      },
      error: err => {
        console.error(err);
      },
    });

  }

  sendMessage(): void {

    if (!this.message.trim() || !this.selectedUser) {
      return;
    }

    this.chatService.sendMessage(
      this.selectedUser.id,
      this.message,
    ).subscribe({

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