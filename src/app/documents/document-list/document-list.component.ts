import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../../document.model';

@Component({
  selector: 'app-document-list',
  standalone: false,
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent implements OnInit {

  documents: Document[] = [
    new Document('1', 'CIT 260 - Object Oriented Programming', 'Learn object-oriented concepts.', '#', []),
    new Document('2', 'CIT 366 - Full Web Stack Development', 'Master frontend and backend skills.', '#', []),
    new Document('3', 'CIT 425 - Data Warehousing', 'Explore data warehouse design and use.', '#', []),
    new Document('4', 'CIT 460 - Enterprise Development', 'Develop enterprise-level apps.', '#', []),
    new Document('5', 'CIT 495 - Senior Practicum', 'Capstone project experience.', '#', [])
  ];

  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  constructor() {}

  ngOnInit() {}

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
