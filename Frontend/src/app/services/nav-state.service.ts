import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavStateService {
  private bookTicketButtonState = new BehaviorSubject<boolean>(true);

  constructor() { }

  // Get the current state as an Observable
  getBookTicketButtonState(): Observable<boolean> {
    return this.bookTicketButtonState.asObservable();
  }

  // Update the visibility state
  setBookTicketButtonState(show: boolean): void {
    this.bookTicketButtonState.next(show);
  }

  // Hide the book ticket button
  hideBookTicketButton(): void {
    this.setBookTicketButtonState(false);
  }

  // Show the book ticket button
  showBookTicketButton(): void {
    this.setBookTicketButtonState(true);
  }
}