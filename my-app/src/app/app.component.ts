import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // styleUrls: ['./app.component.css']
  styles: [`
  h3 {
    color: dodgerblue;
  }

  .white-text {
    color: white;
  }
  `]
})
export class AppComponent {
  username = '';
  showSecret = false;
  log : Array<any> = [];

  onToggleDetails() {
    this.showSecret = !this.showSecret;
    // this.log.push(this.log.length + 1);
    this.log.push(new Date());
  }
}
