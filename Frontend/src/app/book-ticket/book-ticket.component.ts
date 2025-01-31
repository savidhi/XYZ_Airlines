import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { InfyAirlinesService } from '../infy-airlines.service';

@Component({
  selector: 'app-book-ticket',
  templateUrl: './book-ticket.component.html',
  styleUrls: ['./book-ticket.component.css']
})
export class BookTicketComponent implements OnInit {

  constructor(
    private _aRoute: ActivatedRoute,
    private fb: FormBuilder,
    private ias: InfyAirlinesService,
    private router: Router

  ) {}

  public airlinesId: string = '';
  public bookingForm: FormGroup = new FormGroup({});
  public successMessage: string = '';
  public errorMessage: string = '';

  ngOnInit(): void {
    // Fetch airlinesId from route parameters and set it
    this._aRoute.params.subscribe(params => {
      this.airlinesId = params['airlinesId'];
    });

    // Initialize Reactive Form
    this.bookingForm = this.fb.group({
      airlinesId: [{ value: this.airlinesId, disabled: true }, Validators.required], // Disabled field
      customerName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]], // Alphabets and space only
      noOfTickets: ['', [Validators.required, Validators.min(1), Validators.max(6)]], // Min: 1, Max: 6
      dateOfJourney: ['', [Validators.required, this.validateDate]], // Custom date validation
    });
  }

  // Custom validator for validating date
  validateDate(c: FormControl) {
    const selectedDate = new Date(c.value);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      return {
        dateError: { message: "Journey Date can't be a past date" },
      };
    }
    return null; // Valid date
  }

  bookTicket() {
    // Reset successMessage and errorMessage
    this.successMessage = '';
    this.errorMessage = '';

    // Call the service method to book a ticket
    this.ias.bookTicket(this.bookingForm.getRawValue()).subscribe(
      (response: any) => {
        // Success case
        this.successMessage = `Your ticket is successfully booked. Booking ID is ${response.id}`;
      },
      (error: any) => {
        // Error case
        this.errorMessage = 'Booking Failed';
      }
    );
  }
  redirectToAirlines(){
    this.router.navigate(['/airlines']);

  }
}
