import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  maxDocumentId: number;
  documentListChangedEvent = new Subject<Document[]>();

  constructor(private http: HttpClient) {}

  sortAndSend() {
    this.documents.sort((a, b) => (a.name < b.name ? -1 : 1));
    this.documentListChangedEvent.next(this.documents.slice());
  }

  getDocuments() {
    this.http.get<{ message: string; documents: Document[] }>('http://localhost:3000/documents')
      .subscribe(
        (responseData) => {
          this.documents = responseData.documents;
          this.sortAndSend();
        },
        (error) => {
          console.error('Failed to fetch documents:', error);
        }
      );
  }

  getDocument(id: string): Document {
    return this.documents.find((document) => document.id === id);
  }

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    document.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<{ message: string; document: Document }>('http://localhost:3000/documents', document, { headers })
      .subscribe(
        (responseData) => {
          this.documents.push(responseData.document);
          this.sortAndSend();
        },
        (error) => {
          console.error('Failed to add document:', error);
        }
      );
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put('http://localhost:3000/documents/' + originalDocument.id, newDocument, { headers })
      .subscribe(
        (response: Response) => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        },
        (error) => {
          console.error('Failed to update document:', error);
        }
      );
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        (response: Response) => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        },
        (error) => {
          console.error('Failed to delete document:', error);
        }
      );
  }
}
