import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookingService } from '../services/booking.service';
import { Bookings } from '../interface/booking.interface';
import { Airlines } from '../interface/airlines.interface';
import { AirlinesService } from '../airlines.service';
import { NavStateService } from '../services/nav-state.service';

@Component({
  selector: 'app-book-ticket',
  templateUrl: './book-ticket.component.html',
  styleUrls: ['./book-ticket.component.css']
})
export class BookTicketComponent implements OnInit, OnDestroy {
  public airlinesId: string = '';
  public bookingForm: FormGroup;
  public successMessage: string = '';
  public errorMessage: string = '';
  public isSubmitting: boolean = false;
  public showAirlinesDropdown: boolean = false;  // Added property
  public airlines: Airlines[] = [];  // Added airlines array
  private subscriptions: Subscription = new Subscription();

  constructor(
    private _aRoute: ActivatedRoute,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private airlinesService: AirlinesService,
    private router: Router,
    private navStateService: NavStateService  // Add NavStateService
  ) {
    this.bookingForm = this.initializeForm();
  }

  ngOnInit(): void {
    // Hide the Book Ticket button when component initializes
    this.navStateService.hideBookTicketButton();

    const routeSub = this._aRoute.params.subscribe(params => {
      this.airlinesId = params['airlinesId'];
      if (this.airlinesId) {
        this.showAirlinesDropdown = false;
        this.bookingForm.patchValue({ airlinesId: this.airlinesId });
      } else {
        this.showAirlinesDropdown = true;
        this.loadAirlines();
      }
    });
    this.subscriptions.add(routeSub);
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

  ngOnDestroy(): void {
    // Show the Book Ticket button when component is destroyed
    this.navStateService.showBookTicketButton();
    this.subscriptions.unsubscribe();
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      airlinesId: [{ value: '', disabled: true }, Validators.required],
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

  public redirectToAirlines(): void {
    this.router.navigate(['/airlines']);
  }

  public bookTicket(): void {
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
      id: this.bookingForm.get('airlinesId')?.value
    };

    const bookingSub = this.bookingService.bookTicket(bookingData)
      .subscribe({
        next: (response) => {
          this.successMessage = `Your ticket is successfully booked. Booking ID is ${response.id}`;
          this.bookingForm.reset();
        },
        error: (error) => {
          this.errorMessage = error.message || 'Booking Failed. Please try again.';
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });

    this.subscriptions.add(bookingSub);
  }
}