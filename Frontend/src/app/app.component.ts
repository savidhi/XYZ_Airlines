import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavStateService } from './services/nav-state.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BookingPopupComponent } from './booking-popup/booking-popup.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isNavbarCollapsed = true;
  showBookTicketButton = true;
  private subscription: Subscription;

  constructor(
    private navStateService: NavStateService,
    private modalService: NgbModal
  ) {
    this.subscription = this.navStateService.getBookTicketButtonState()
      .subscribe(state => this.showBookTicketButton = state);
  }

  openBookingPopup(): void {
    this.modalService.open(BookingPopupComponent, {
      centered: true,
      size: 'lg'
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
