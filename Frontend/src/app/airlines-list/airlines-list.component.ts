import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InfyAirlinesService } from '../infy-airlines.service';

@Component({
  selector: 'app-airlines-list',
  templateUrl: './airlines-list.component.html',
  styleUrls: ['./airlines-list.component.css']
})
export class AirlinesListComponent implements OnInit {
  public airlinesArray: any[] = [];
  public errorMessage: string = "";

  constructor(private infyAirlinesService: InfyAirlinesService, private router: Router) {}

  ngOnInit(): void {
    this.getAirlines(); // Invoke getAirlines() on component load
  }

  getAirlines(): void {
    this.infyAirlinesService.getAirlines().subscribe({
      next: (response) => {
        this.airlinesArray = response; // Assign response data to airlinesArray
      },
      error: () => {
        this.errorMessage = "Something went wrong"; // Set error message on failure
      }
    });
  }

  showBookingForm(airlinesId: any): void {
    // Navigate to the /book-ticket/:airlinesId route
    this.router.navigate(['/book-ticket', airlinesId]);
  }
}
