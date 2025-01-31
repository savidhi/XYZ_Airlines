import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfyAirlinesService {

  private baseUrl = 'http://localhost:3000'; // Base URL for the API

  constructor(private http: HttpClient) {}

  // Function to fetch the list of airlines
  getAirlines(): Observable<any> {
    /*
      1. Sends a GET request to the API endpoint: http://localhost:3000/airlines/
      2. Returns the Observable from the HttpClient.
    */
    return this.http.get<any>(`${this.baseUrl}/airlines/`);
  }

  // Function to book a ticket
  bookTicket(bookingObj: any): Observable<any> {
    /*
      1. Sends a POST request to the API endpoint: http://localhost:3000/bookings/
         and passes bookingObj as the request body.
      2. Returns the Observable from the HttpClient.
    */
    return this.http.post<any>(`${this.baseUrl}/bookings/`, bookingObj);
  }
}
