import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Contact } from '../contact.model';
import { ContactService } from '../../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule]
})
export class ContactEditComponent implements OnInit {
  contact!: Contact;
  groupContacts: Contact[] = [];
  editMode = false;
  id!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.editMode = this.id != null;

      if (this.editMode) {
        const origContact = this.contactService.getContact(this.id);
        if (!origContact) return;

        this.contact = JSON.parse(JSON.stringify(origContact));
        this.groupContacts = this.contact.group || [];
      } else {
        this.contact = new Contact('', '', '', '', '', []);
        this.groupContacts = [];
      }
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newContact = new Contact(
      this.contact.id,
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts
    );

    if (this.editMode) {
      this.contactService.updateContact(this.contact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }

    this.router.navigate(['/contacts']);
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }

  onRemoveItem(index: number) {
    if (index >= 0 && index < this.groupContacts.length) {
      this.groupContacts.splice(index, 1);
    }
  }

  onDrop(event: CdkDragDrop<Contact[]>) {
    const draggedContact = event.item.data;
    if (this.isInvalidContact(draggedContact)) return;
    this.groupContacts.push(draggedContact);
  }

  isInvalidContact(newContact: Contact): boolean {
    if (!newContact || this.contact.id === newContact.id) return true;
    return this.groupContacts.some(c => newContact.id === c.id);
  }
}
