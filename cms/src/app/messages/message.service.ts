import { Injectable } from '@angular/core';
import { Message } from './message.model';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messageChangedEvent = new Subject<Message[]>();
  private messages: Message[] = [];
  // maxMessageId: number;

  constructor(private http: HttpClient) {}

  getMessage(id: string) {
    return this.http.get<{ messageI: string, message: Message }>('http://localhost:3000/messages/' + id);
  }

  getMessages() {
    this.http.get<{ message: string, messages: Message[] }>('http://localhost:3000/messages/').subscribe(
      //Success method
      (responseData) => {
        this.messages = responseData.messages;
        // this.maxMessageId = this.getMaxId();
        this.messageChangedEvent.next(this.messages.slice());
      },
      //error function
      (error: any) => {
        console.log(error);
      }
    );
  }

  // storeMessages() {
  //   const messages = JSON.parse(JSON.stringify(this.messages));
    
  //   this.http.put("https://cmsdb-74fda-default-rtdb.firebaseio.com/messages.json", messages, this.httpHeader).subscribe(
  //     response => {
  //       this.messageChangedEvent.next(this.messages.slice());
  //       console.log(response);
  //     }
  //   );
  // }

  addMessage(message: Message) {
    if (!message) {
      return;
    }
    message.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    this.http.post<{ messageI: string, message: Message}>('http://localhost:3000/messages', message, { headers: headers }).subscribe(
      (responseData) => {
        this.messages.push(responseData.message);
        this.messageChangedEvent.next(this.messages.slice());
      }
    );
  }

  // getMaxId(): number {
  //   var maxId = 0;
  //   this.messages.forEach(message => {
  //     var currentId = +message.id;
  //     if (currentId > maxId) {
  //       maxId = currentId;
  //     }
  //   });
  //   return maxId;
  //  }
}
