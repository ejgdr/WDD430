import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../document.service';
import { Document } from '../document.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;
  groupDocuments: Document[] = [];
  id: string;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      if(!this.id){
        this.editMode = false;
        return;
      }
      this.documentService.getDocument(this.id).subscribe(
        documentData => {
          this.originalDocument = documentData.document;
          if(!this.originalDocument) {
            return;
          }
          this.editMode = true;
          this.document = JSON.parse(JSON.stringify(this.originalDocument));
        }
      );
      
    });
  }

  onSubmit(form: NgForm) {
    const value = form.value;

    const newDocument =  new Document(
      '',
      '',
      value.name,
      value.description,
      value.url,
      this.groupDocuments );
    
    if(this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    }else {
      this.documentService.addDocument(newDocument);
    }
    this.router.navigate(['/documents']);
  }

  onCancel() {
    this.router.navigate(['/documents']);
  }

}
