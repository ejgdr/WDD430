import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WizardsDisplayComponent } from './wizards-display/wizards-display.component';

const routes: Routes = [
  { path: '', redirectTo: 'wizards', pathMatch: 'full' },
  { path: 'wizards', component: WizardsDisplayComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
