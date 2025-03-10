import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../services/booking.service';
import { DatePipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BookingPopupComponent } from '../booking-popup/booking-popup.component';
import { Bookings } from '../interface/booking.interface';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-bookings-list',
  templateUrl: './bookings-list.component.html',
  styleUrls: ['./bookings-list.component.css'],
  providers: [DatePipe],
  standalone: true,
  imports: [CommonModule, NgbModule]
})
export class BookingsListComponent implements OnInit {
  bookings: any[] = [];
  errorMessage = '';
  isLoading = false;

  constructor(
    private bookingService: BookingService,
    private modalService: NgbModal,
    private datePipe: DatePipe  // Add DatePipe injection
  ) { }

  editBooking(booking: Bookings): void {
    const modalRef = this.modalService.open(BookingPopupComponent, {
      centered: true,
      size: 'lg'
    });
    
    // Pass the booking data to the popup
    modalRef.componentInstance.editMode = true;
    modalRef.componentInstance.existingBooking = booking;

    // Handle the result after modal closes
    modalRef.closed.subscribe(result => {
      if (result) {
        // Refresh the bookings list
        this.loadBookings();
      }
    });
  }

  ngOnInit() {
    this.loadBookings();
  }

  // ✅ Fetch Bookings from API
  private loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getBookings().subscribe({
      next: (data: any[]) => {
        this.bookings = data.map(booking => ({
          ...booking,
          dateOfJourney: new Date(booking.dateOfJourney) // ✅ Convert to Date
        }));
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Failed to load bookings. Please try again.';
        console.error('Error loading bookings:', error);
        this.isLoading = false;
      }
    });
  }

  // ✅ Format Date using DatePipe
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'MM/dd/yyyy') || '';
  }

  // ✅ Edit Booking (Navigate to Edit Page)

  // Delete Booking
  // Update deleteBooking method
  deleteBooking(id: string) {
    const modalRef = this.modalService.open(ConfirmDialogComponent, {
      centered: true
    });
    
    modalRef.closed.subscribe(result => {
      if (result === true) {
        this.bookingService.deleteBooking(id).subscribe({
          next: () => {
            this.bookings = this.bookings.filter(b => b.id !== id);
            this.errorMessage = 'Booking deleted successfully!';
          },
          error: () => {
            this.errorMessage = 'Failed to delete booking.';
          }
        });
      }
    });
  }
}
