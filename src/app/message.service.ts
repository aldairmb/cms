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
  private firebaseUrl = 'https://aldair-wdd430-default-rtdb.firebaseio.com/';

  constructor(private http: HttpClient) {
    this.getMessages();
  }

  getMessages() {
    this.http.get<Message[]>(this.firebaseUrl + 'messages.json').subscribe(
      (messages: Message[]) => {
        this.messages = messages ?? [];
        this.maxMessageId = this.getMaxId();
        this.messageChangedEvent.emit(this.messages.slice());
      },
      (error: any) => {
        console.error('Error fetching messages from Firebase:', error);
      }
    );
  }

  storeMessages() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http.put(this.firebaseUrl + 'messages.json', this.messages, { headers }).subscribe(() => {
      this.messageChangedEvent.emit(this.messages.slice());
    });
  }

  getMaxId(): number {
    let maxId = 0;
    for (let message of this.messages) {
      const currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addMessage(message: Message): void {
    if (!message) return;
    this.maxMessageId++;
    message.id = this.maxMessageId.toString();
    this.messages.push(message);
    this.storeMessages();
  }
}
