import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Contact } from './contacts/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contacts: Contact[] = [];
  contactListChangedEvent = new Subject<Contact[]>();
  maxContactId: number;

  constructor(private http: HttpClient) {
    this.getContacts();
  }

  getContacts() {
    this.http.get<{ message: string; contacts: Contact[] }>('http://localhost:3000/contacts')
      .subscribe(
        (responseData) => {
          this.contacts = responseData.contacts;
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error) => {
          console.error('Failed to fetch contacts:', error);
        }
      );
  }

  getContact(id: string): Contact {
    return this.contacts.find(c => c.id === id);
  }

  addContact(contact: Contact) {
    if (!contact) return;

    contact.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<{ message: string; contact: Contact }>('http://localhost:3000/contacts', contact, { headers })
      .subscribe(
        (responseData) => {
          this.contacts.push(responseData.contact);
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error) => {
          console.error('Failed to add contact:', error);
        }
      );
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) return;

    const pos = this.contacts.findIndex(c => c.id === originalContact.id);
    if (pos < 0) return;

    newContact.id = originalContact.id;
    newContact._id = originalContact._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put('http://localhost:3000/contacts/' + originalContact.id, newContact, { headers })
      .subscribe(
        (response: Response) => {
          this.contacts[pos] = newContact;
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error) => {
          console.error('Failed to update contact:', error);
        }
      );
  }

  deleteContact(contact: Contact) {
    if (!contact) return;

    const pos = this.contacts.findIndex(c => c.id === contact.id);
    if (pos < 0) return;

    this.http.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(
        (response: Response) => {
          this.contacts.splice(pos, 1);
          this.contactListChangedEvent.next(this.contacts.slice());
        },
        (error) => {
          console.error('Failed to delete contact:', error);
        }
      );
  }
}
