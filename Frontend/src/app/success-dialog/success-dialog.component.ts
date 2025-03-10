import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-dialog',
  templateUrl: './success-dialog.component.html',
  styleUrls: ['./success-dialog.component.css']
})
export class SuccessDialogComponent {
  @Input() message: string = '';
  @Input() bookingData: any;
  @Input() isEdit: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router
  ) {}

  viewBooking(): void {
    this.activeModal.close({ action: 'view', booking: this.bookingData });
    window.location.reload();
  }

  editBooking(): void {
    this.activeModal.close({ action: 'edit', booking: this.bookingData });
  }

  viewOtherFlights(): void {
    this.activeModal.dismiss();
    this.router.navigate(['/airlines']).then(() => {
      window.location.reload();
    });
  }
}
