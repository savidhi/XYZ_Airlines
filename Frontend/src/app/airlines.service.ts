import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AirlinesService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAirlines(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/airlines/`);
  }

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

  bookTicket(bookingObj: any): Observable<any> {
    return this.getNextBookingId().pipe(
      switchMap(nextId => {
        const bookingWithId = { ...bookingObj, id: nextId };
        return this.http.post<any>(`${this.baseUrl}/bookings/`, bookingWithId);
      })
    );
  }

  getBookings(): Observable<any> {
    return this.http.get(`${this.baseUrl}/bookings`);
  }

  deleteBooking(id: string): Observable<any> {
      return this.http.delete(`${this.baseUrl}/bookings/${id}`);
    }

  updateBooking(id: string, bookingObj: any): Observable<any> {
      return this.http.put<any>(`${this.baseUrl}/bookings/${id}`, bookingObj);
    }
}
