import { Component, OnInit } from '@angular/core';
import { ContactService } from '../contact.service';
import { Contact } from '../contact.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string; 
  hasInvalidContact = false;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      if(!this.id){
        this.editMode = false;
        return;
      }
      this.contactService.getContact(this.id).subscribe(
        contactData => {
          this.originalContact = contactData.contact;
      });
      if(!this.originalContact) {
          return;
      }
      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));
      if(this.originalContact.group && this.originalContact.group.length > 0) {
        this.groupContacts = JSON.parse(JSON.stringify(this.originalContact.group));
      }
    });
    // //Teacher's way. I cannot use subscribe for the contactService in line 48
    // this.route.params.subscribe((params: Params) => {
    //   this.id = params['id'];
    //   if (!this.id) {
    //     this.editMode = false;
    //     return;
    //   }
    //   this.contactService.getContact(this.id).subscribe(contactData => {
    //     this.originalContact = contactData.contact;
    //     if (!this.originalContact) {
    //       return;
    //     }
    //     this.editMode = true;
    //     this.contact = JSON.parse(JSON.stringify(this.originalContact));
    //     if (this.originalContact.group && this.originalContact.group.length > 0) {
    //       this.groupContacts = JSON.parse(JSON.stringify(this.originalContact.group))
    //     }
    //   });
    // });
  }
  
  onSubmit(form: NgForm) {
    const value = form.value;

    const newContact = new Contact(
      '',
      '',
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts
    );

    if(this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }
    this.router.navigate(['/contacts']);

  }
  
  onCancel() {
    this.router.navigate(['/contacts']);
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {// newContact has no value
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
       this.hasInvalidContact = true;
       return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++){
       if (newContact.id === this.groupContacts[i].id) {
        this.hasInvalidContact = true;
         return true;
      }
    }
    this.hasInvalidContact = false;
    return false;
  }

  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact){
        return;
    }
    this.groupContacts.push(selectedContact);
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
       return;
    }
    this.groupContacts.splice(index, 1);
 }
}
