import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';
import { Bookings } from '../interface/booking.interface';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly baseUrl = 'http://localhost:3000/bookings';
  constructor(private http: HttpClient) { }

  private getNextBookingId(): Observable<string> {
    return this.getBookings().pipe(
      map(bookings => {
        const ids = bookings
          .map((booking: { id: string }) => {
            const idMatch = booking.id.match(/BK-(\d+)/);
            return idMatch ? parseInt(idMatch[1]) : 0;
          })
          .filter((id: number) => !isNaN(id))
          .sort((a: number, b: number) => b - a);
        
        const nextNumber = (ids[0] || 1000) + 1;
        return `BK-${nextNumber}`;
      })
    );
  }

  getBookings(): Observable<Bookings[]> {
    return this.http.get<Bookings[]>(this.baseUrl);
  }

  getBookingById(id: string): Observable<Bookings> {
    return this.http.get<Bookings>(`${this.baseUrl}/${id}`);
  }

  bookTicket(bookingObj: Bookings): Observable<Bookings> {
    return this.getNextBookingId().pipe(
      switchMap(nextId => {
        const bookingWithId = { ...bookingObj, id: nextId };
        return this.http.post<Bookings>(this.baseUrl, bookingWithId);
      })
    );
  }

  updateBooking(id: string, booking: Bookings): Observable<Bookings> {
    return this.http.put<Bookings>(`${this.baseUrl}/${id}`, booking);
  }

  deleteBooking(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}