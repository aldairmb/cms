import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../../message.service';

@Component({
  selector: 'app-message-list',
  standalone: false,
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    // Subscribe to message change event
    this.messageService.messageChangedEvent.subscribe((messages: Message[]) => {
      this.messages = messages;
    });

    // Initiate fetching from Firebase
    this.messageService.getMessages();
  }
}
