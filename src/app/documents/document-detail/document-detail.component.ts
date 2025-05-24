import { Component, Input, OnInit } from '@angular/core';
import { Document } from '../../document.model';
import { DocumentService } from '../../document.service';

@Component({
  selector: 'app-document-detail',
  standalone: false,
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.css'
})
export class DocumentDetailComponent implements OnInit {

  document: Document;

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.documentService.documentSelectedEvent.subscribe((doc: Document) => {
      this.document = doc;
    });
  }

  

}
