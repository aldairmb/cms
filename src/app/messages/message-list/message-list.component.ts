import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-list',
  standalone: false,
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent {

  messages: Message[] = [
    new Message('1', 'Assignment Grades', 'The grades for this assignment have been posted', 'Bro. Jackson'),
    new Message('2', 'Assignment Question', 'When is assignment 3 due', 'Steve Johnson'),
    new Message('3', 'Assignment Due Date', 'Assignment 3 is due on Saturday at 11:30 PM', 'Bro. Jackson'),
    new Message('4', 'Help with Assignment', 'Can I meet with you sometime. I need help with assignment 3', 'Mark Smith'),
    new Message('5', 'Office Hours', 'I can meet with you today at 4:00 PM in my office.', 'Bro. Jackson')
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}
