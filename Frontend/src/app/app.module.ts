import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookingPopupComponent } from './booking-popup/booking-popup.component';
import { AirlinesListComponent } from './airlines-list/airlines-list.component';
import { BookTicketComponent } from './book-ticket/book-ticket.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import { BookingsListComponent } from './bookings-list/bookings-list.component';

@NgModule({
  declarations: [
    AppComponent,
    AirlinesListComponent,
    BookTicketComponent,
    // Remove ConfirmDialogComponent from declarations
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,  // This should handle all routing configuration
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    BookingsListComponent,
    // Remove BookingPopupComponent from here since it's standalone
    // Add ConfirmDialogComponent to imports instead of declarations
    ConfirmDialogComponent
  ],
  providers: [
    NgbActiveModal
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
