import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BookingService } from '../services/booking.service';
import { AirlinesService } from '../services/airlines.service';
import { Airlines } from '../interface/airlines.interface';
import { Bookings } from '../interface/booking.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-booking-popup',
  templateUrl: './booking-popup.component.html',
  styleUrls: ['./booking-popup.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class BookingPopupComponent implements OnInit, OnDestroy {
  public bookingForm: FormGroup;
  public airlines: Airlines[] = [];
  public successMessage: string = '';
  public errorMessage: string = '';
  public isSubmitting: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private airlinesService: AirlinesService
  ) {
    this.bookingForm = this.initializeForm();
  }

  @Input() editMode: boolean = false;
  @Input() existingBooking: Bookings | null = null;

  ngOnInit(): void {
    if (this.editMode && this.existingBooking) {
      // Format the date to YYYY-MM-DD for the input type="date"
      const formattedDate = new Date(this.existingBooking.dateOfJourney)
        .toISOString()
        .split('T')[0];

      this.bookingForm.patchValue({
        airlinesId: this.existingBooking.airlinesId,
        customerName: this.existingBooking.customerName,
        noOfTickets: this.existingBooking.noOfTickets,
        dateOfJourney: formattedDate
      });
    }
    this.loadAirlines();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      airlinesId: ['', Validators.required],
      customerName: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z\s]*$/),
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      noOfTickets: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(6)
      ]],
      dateOfJourney: ['', [Validators.required, this.validateDate]]
    });
  }

  private validateDate(c: FormControl) {
    const selectedDate = new Date(c.value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate) {
      return {
        dateError: { message: "Journey Date can't be a past date" }
      };
    }
    return null;
  }

  private loadAirlines(): void {
    const airlinesSub = this.airlinesService.getAirlines().subscribe({
      next: (airlines) => {
        this.airlines = airlines;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load airlines. Please try again.';
        console.error('Error loading airlines:', error);
      }
    });
    this.subscriptions.add(airlinesSub);
  }

  public submitForm(): void {
    if (this.bookingForm.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const bookingData: Bookings = {
      airlinesId: this.bookingForm.get('airlinesId')?.value,
      customerName: this.bookingForm.get('customerName')?.value,
      noOfTickets: this.bookingForm.get('noOfTickets')?.value,
      dateOfJourney: this.bookingForm.get('dateOfJourney')?.value,
      id: this.editMode && this.existingBooking ? this.existingBooking.id : ''
    };

    let bookingSub;
    if (this.editMode && this.existingBooking) {
      // Update existing booking
      bookingSub = this.bookingService.updateBooking(this.existingBooking.id, bookingData)
        .subscribe({
          next: (response) => {
            this.successMessage = 'Booking updated successfully';
            setTimeout(() => this.activeModal.close(response), 2000);
          },
          error: (error) => {
            this.errorMessage = error.message || 'Update Failed. Please try again.';
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
    } else {
      // Create new booking
      bookingSub = this.bookingService.bookTicket(bookingData)
        .subscribe({
          next: (response) => {
            this.successMessage = `Your ticket is successfully booked. Booking ID is ${response.id}`;
            setTimeout(() => this.activeModal.close(response), 2000);
          },
          error: (error) => {
            this.errorMessage = error.message || 'Booking Failed. Please try again.';
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
    }

    this.subscriptions.add(bookingSub);
  }
}
