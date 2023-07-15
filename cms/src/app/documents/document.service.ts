import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject} from 'rxjs';
import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentListChangedEvent = new Subject<Document[]>();
  private documents: Document[] = [];
  // maxDocumentId: number;

  constructor(private http: HttpClient) {}

  sortAndSend(){
    this.documents.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    this.documentListChangedEvent.next(this.documents.slice());
  }

  addDocument(document: Document) {
    if (!document) {
      return;
    }
  
    // make sure id of the new Document is empty
    document.id = '';
  
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
    // add to database
    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
          this.sortAndSend();
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

    // delete from database
    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        (response: Response) => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        }
      );
  }

  getDocument(id: string) {
    return this.http.get<{ message: string, document: Document }>('http://localhost:3000/documents/' + id);
  }

  getDocuments() {
    this.http.get<{ message: string, documents: Document[] }>('http://localhost:3000/documents/').subscribe(
      (responseData) => {
        this.documents = responseData.documents;
        // this.maxDocumentId = this.getMaxId();
        this.sortAndSend();
      },
      //error function
      (error: any) => {
        console.log(error);
      }
    );
  }

  // storeDocuments() {
  //   const documents = JSON.parse(JSON.stringify(this.documents));
    
  //   this.http.put("https://cmsdb-74fda-default-rtdb.firebaseio.com/documents.json", documents, this.httpHeader).subscribe(
  //     response => {
  //       this.documentListChangedEvent.next(this.documents.slice());
  //       console.log(response);
  //     }
  //   );
  // }

//   getMaxId(): number {
//   var maxId = 0;
//   this.documents.forEach(document => {
//     var currentId = +document.id;
//     if (currentId > maxId) {
//       maxId = currentId;
//     }
//   });
//   return maxId;
//  }

 

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
    newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        }
      );
  }
  
}
