import { EventEmitter, Injectable } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactListChangedEvent = new Subject<Contact[]>();
  contacts: Contact[] = [];
  maxContactId: number;
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  
  contactSelectedEvent = new EventEmitter<Contact>();

  constructor(private http: HttpClient) {
    this.contacts = MOCKCONTACTS;
  }

  getContacts() {
    this.http.get("https://cmsdb-74fda-default-rtdb.firebaseio.com/contacts.json").subscribe(
      //Success method
      (contacts: Contact[]) => {
        this.contacts = contacts;
        this.maxContactId = this.getMaxId();
        this.contacts.sort((a, b) => (a.name > b.name ? 1 : b.name ? -1 : 0));
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      //error function
      (error: any) => {
        console.log(error);
      }
    );
  }

  storeContacts() {
    const contacts = JSON.parse(JSON.stringify(this.contacts));
    
    this.http.put("https://cmsdb-74fda-default-rtdb.firebaseio.com/contacts.json", contacts, this.httpHeader).subscribe(
      response => {
        this.contactListChangedEvent.next(this.contacts.slice());
        console.log(response);
      }
    );
  }

  getContact(id: string): Contact {
    return this.contacts.find((contact) => contact.id === id);
  }

  deleteContact(contact: Contact) {
    if (!contact) {
       return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
       return;
    }
    this.contacts.splice(pos, 1);
    // const contactsListClone = this.contacts.slice()
    // this.contactListChangedEvent.next(contactsListClone);
    this.storeContacts();
  }

  getMaxId(): number {
    var maxId = 0;
    this.contacts.forEach(contact => {
      var currentId = +contact.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    });
    return maxId;
   }
  
    addContact(newContact: Contact) {
      if (!newContact) {
        return;
      }
      this.maxContactId++;
      newContact.id = this.maxContactId.toString();
      this.contacts.push(newContact);
      // const contactsListClone = this.contacts.slice();
      // this.contactListChangedEvent.next(contactsListClone);
      this.storeContacts();
    }
  
    updateContact(originalContact: Contact, newContact: Contact) {
      if (!originalContact|| !newContact) {
        return;
      }
  
      const pos = this.contacts.indexOf(originalContact);
      if (pos < 0) {
        return;
      }
  
      newContact.id = originalContact.id;
      this.contacts[pos] = newContact;
      // const contactsListClone = this.contacts.slice();
      // this.contactListChangedEvent.next(contactsListClone);
      this.storeContacts();
    }
}

