import { Component, EventEmitter, Output } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../../contact.service';

@Component({
  selector: 'app-contact-list',
  standalone: false,
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent {
  @Output() selectedContactEvent = new EventEmitter<Contact>();

  contacts: Contact[] = [];

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contacts = this.contactService.getContacts();
  }

  onSelected(contact: Contact): void {
    this.selectedContactEvent.emit(contact);
  }
}
