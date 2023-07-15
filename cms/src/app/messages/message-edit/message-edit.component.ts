import { Component,OnInit,ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Contact } from 'src/app/contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject') subject: ElementRef; 
  @ViewChild('msgText') msgText: ElementRef; 
  
  currentSender: Contact;

  constructor(private messageService: MessageService,
    private contactService: ContactService) {}

    ngOnInit() {
      this.contactService.getContact('102')
        .subscribe(
          response => {
            this.currentSender = response.contact;
          }
        );
    }

  onSendMessage(){
    const subject = this.subject.nativeElement.value;
    const msgText = this.msgText.nativeElement.value;

    const message = new Message ('', '', subject, msgText, this.currentSender);

    this.messageService.addMessage(message);
    this.onClear();
  }

  onClear() {
    this.subject.nativeElement.value = '';
    this.msgText.nativeElement.value = '';
  }

}
