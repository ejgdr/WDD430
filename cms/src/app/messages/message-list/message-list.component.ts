import { Component, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent {
  messages: Message[] = [
    new Message('1', 'Test 1', 'The grades have been posted', 'Bro. Jackson'),
    new Message('2', 'Test 2', 'When is assignment 3 due?', 'Steve Johnson')
  ]

  onAddMessage(message: Message){
    this.messages.push(message);
  }

}
