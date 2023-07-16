import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Wizard } from './wizard';

@Injectable({
  providedIn: 'root'
})
export class WizardService {
  private url = 'http://localhost:3000';
  private wizards$: Subject<Wizard[]> = new Subject();

  constructor(private httpClient: HttpClient) { }

  private refreshWizards() {
    this.httpClient.get<Wizard[]>(`${this.url}/wizards`)
      .subscribe(wizards => {
        this.wizards$.next(wizards);
      });
  }

  getWizards(): Subject<Wizard[]> {
    this.refreshWizards();
    return this.wizards$;
  }

  getWizard(id: string): Observable<Wizard> {
    return this.httpClient.get<Wizard>(`${this.url}/wizards/${id}`);
  }

  createWizard(wizard: Wizard): Observable<string> {
    return this.httpClient.post(`${this.url}/wizards`, wizard, { responseType: 'text' });
  }

  updateWizard(id: string, wizard: Wizard): Observable<string> {
    return this.httpClient.put(`${this.url}/wizards/${id}`, wizard, { responseType: 'text' });
  }

  deleteWizard(id: string): Observable<string> {
    return this.httpClient.delete(`${this.url}/wizards/${id}`, { responseType: 'text' });
  }
}
