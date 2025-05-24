import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './messages/message.model';
import { MOCKMESSAGES } from './messages/MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = MOCKMESSAGES;

  messageChangedEvent = new EventEmitter<Message[]>();

  constructor() {}

  getMessages(): Message[] {
    return this.messages.slice();
  }

  addMessage(message: Message): void {
    if (!message) return;
    this.messages.push(message);
    this.messageChangedEvent.emit(this.messages.slice());
  }

}
