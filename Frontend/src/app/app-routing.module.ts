import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AirlinesListComponent } from './airlines-list/airlines-list.component';
import { BookTicketComponent } from './book-ticket/book-ticket.component';

const routes: Routes = [
  {
    path: 'airlines',
    component: AirlinesListComponent // Loads AirlinesListComponent for '/airlines'
  },
  {
    path: 'book-ticket/:airlinesId',
    component: BookTicketComponent // Loads BookTicketComponent for '/book-ticket/:airlinesId'
  },
  {
    path: '', 
    redirectTo: '/airlines', 
    pathMatch: 'full' // Redirect root path to '/airlines'
  },
  {
    path: '**', 
    redirectTo: '/airlines' // Redirect any invalid route to '/airlines'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
