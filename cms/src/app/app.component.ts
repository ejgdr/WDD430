import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'cms-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cms';
  selectedFeatureEvent = 'documents';

  switchView(selectedFeature: string){
    this.selectedFeatureEvent = selectedFeature;
  }
}
