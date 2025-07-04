import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from './messages/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();
  maxMessageId: number;

  constructor(private http: HttpClient) {
    this.getMessages();
  }

  getMessages() {
    this.http.get<{ message: string; messages: Message[] }>('http://localhost:3000/messages')
      .subscribe(
        (responseData) => {
          this.messages = responseData.messages;
          this.messageChangedEvent.emit(this.messages.slice());
        },
        (error) => {
          console.error('Failed to fetch messages:', error);
        }
      );
  }

  getMessage(id: string): Message {
    return this.messages.find((message) => message.id === id);
  }

  addMessage(message: Message) {
    if (!message) return;

    message.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<{ message: string; newMessage: Message }>('http://localhost:3000/messages', message, { headers })
      .subscribe(
        (responseData) => {
          this.messages.push(responseData.newMessage);
          this.messageChangedEvent.emit(this.messages.slice());
        },
        (error) => {
          console.error('Failed to add message:', error);
        }
      );
  }

  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) return;

    const pos = this.messages.findIndex(m => m.id === originalMessage.id);
    if (pos < 0) return;

    newMessage.id = originalMessage.id;
    newMessage._id = originalMessage._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put('http://localhost:3000/messages/' + originalMessage.id, newMessage, { headers })
      .subscribe(
        (response: Response) => {
          this.messages[pos] = newMessage;
          this.messageChangedEvent.emit(this.messages.slice());
        },
        (error) => {
          console.error('Failed to update message:', error);
        }
      );
  }

  deleteMessage(message: Message) {
    if (!message) return;

    const pos = this.messages.findIndex(m => m.id === message.id);
    if (pos < 0) return;

    this.http.delete('http://localhost:3000/messages/' + message.id)
      .subscribe(
        (response: Response) => {
          this.messages.splice(pos, 1);
          this.messageChangedEvent.emit(this.messages.slice());
        },
        (error) => {
          console.error('Failed to delete message:', error);
        }
      );
  }
}
