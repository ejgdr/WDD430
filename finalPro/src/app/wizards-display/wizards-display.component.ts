import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Wizard } from '../wizard';
import { WizardService } from '../wizard.service';

@Component({
  selector: 'app-wizards-display',
  templateUrl: './wizards-display.component.html',
  styleUrls: ['./wizards-display.component.css']
})
export class WizardsDisplayComponent implements OnInit {
  wizards$: Observable<Wizard[]> = new Observable();
 
  constructor(private wizardsService: WizardService) { }
 
  ngOnInit(): void {
    this.fetchWizards();
  }
 
  deleteWizard(id: string): void {
    this.wizardsService.deleteWizard(id).subscribe({
      next: () => this.fetchWizards()
    });
  }
 
  private fetchWizards(): void {
    this.wizards$ = this.wizardsService.getWizards();
  }
}
