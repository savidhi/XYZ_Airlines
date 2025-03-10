import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AirlinesService } from '../services/airlines.service';
import { Airlines } from '../interface/airlines.interface';

@Component({
  selector: 'app-airlines-list',
  templateUrl: './airlines-list.component.html',
  styleUrls: ['./airlines-list.component.css']
})
export class AirlinesListComponent implements OnInit {
  public airlinesArray: Airlines[] = [];
  public errorMessage: string = "";
  public isLoading: boolean = true;


  constructor(private airlinesService: AirlinesService, private router: Router) {}

  ngOnInit(): void {
    this.airlinesService.getAirlines().subscribe(
      (data: Airlines[]) => {
        this.airlinesArray = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'No airlines available at the moment. Please try again later.';
        this.isLoading = false;
      }
    );
  }

  showBookingForm(airlinesId: any): void {
    // Navigate to the /book-ticket/:airlinesId route
    this.router.navigate(['/book-ticket', airlinesId]);
  }
}
