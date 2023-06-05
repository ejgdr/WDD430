import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
   // so I can remove the onSelect method because I don't have the click in the html.component and the event emitter
   // I erased the correspondant imports up there because are not in use
  // @Output() featureSelected = new EventEmitter<string>();
 
  // onSelect(feature: string) {
  //   this.featureSelected.emit(feature);
  // }
}
