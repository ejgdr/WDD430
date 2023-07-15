import { Component } from '@angular/core';
import { Document } from './document.model';
import { DocumentService } from './document.service';

@Component({
  selector: 'cms-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent {
  selectedDocument: Document;

  constructor(private documentService: DocumentService) {}

  // ngOnInit() {
  //   this.documentService.documentListChangedEvent.subscribe(
  //     (document: Document) => {this.selectedDocument = document}
  //   );
  // }
}
