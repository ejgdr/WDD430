import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();
  maxMessageId: number;
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {
    this.messages = MOCKMESSAGES; 
    this.maxMessageId = this.getMaxId(); 
  }

  getMessages() {
    this.http.get("https://cmsdb-74fda-default-rtdb.firebaseio.com/messages.json").subscribe(
      //Success method
      (messages: Message[]) => {
        this.messages = messages;
        this.maxMessageId = this.getMaxId();
        this.messageChangedEvent.next(this.messages.slice());
      },
      //error function
      (error: any) => {
        console.log(error);
      }
    );
  }

  storeMessages() {
    const messages = JSON.parse(JSON.stringify(this.messages));
    
    this.http.put("https://cmsdb-74fda-default-rtdb.firebaseio.com/messages.json", messages, this.httpHeader).subscribe(
      response => {
        this.messageChangedEvent.next(this.messages.slice());
        console.log(response);
      }
    );
  }

  getMessage(id: string): Message {
    return this.messages.find((message) => message.id === id);
  }

  addMessage(message: Message) {
    this.messages.push(message);
    // this.messageChangedEvent.emit(this.messages.slice());
    this.storeMessages();
  }

  getMaxId(): number {
    var maxId = 0;
    this.messages.forEach(message => {
      var currentId = +message.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
   }
}
