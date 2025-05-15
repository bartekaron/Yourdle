import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RestorepassComponent } from './components/restorepass/restorepass.component';
// Import other components as needed

const routes: Routes = [
  // Other routes...
  { path: 'restorepass/:userId/:token', component: RestorepassComponent },
  // More routes...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }