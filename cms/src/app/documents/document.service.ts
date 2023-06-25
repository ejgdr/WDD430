import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentListChangedEvent = new Subject<Document[]>();
  documents: Document[] = [];
  maxDocumentId: number;
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  documentSelectedEvent = new EventEmitter<Document>();

  constructor(private http: HttpClient) { 
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getDocuments() {
    this.http.get("https://cmsdb-74fda-default-rtdb.firebaseio.com/documents.json").subscribe(
      //Success method
      (documents: Document[]) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();
        this.documents.sort((a, b) => (a.name > b.name ? 1 : b.name ? -1 : 0));
        this.documentListChangedEvent.next(this.documents.slice());
      },
      //error function
      (error: any) => {
        console.log(error);
      }
    );
  }

  storeDocuments() {
    const documents = JSON.parse(JSON.stringify(this.documents));
    
    this.http.put("https://cmsdb-74fda-default-rtdb.firebaseio.com/documents.json", documents, this.httpHeader).subscribe(
      response => {
        this.documentListChangedEvent.next(this.documents.slice());
        console.log(response);
      }
    );
  }

  getDocument(id: string): Document {
    return this.documents.find((document) => document.id === id);
  }

  deleteDocument(document: Document) {
    if (!document) {
       return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
       return;
    }
    this.documents.splice(pos, 1);
    // const documentsListClone = this.documents.slice()
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
 }

  getMaxId(): number {
  var maxId = 0;
  this.documents.forEach(document => {
    var currentId = +document.id;
    if (currentId > maxId) {
      maxId = currentId;
    }
  });
  return maxId;
 }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    // const documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument|| !newDocument) {
      return;
    }

    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    // const documentsListClone = this.documents.slice();
    // this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
  }
  
}
