import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Airlines } from '../interface/airlines.interface';

@Injectable({
  providedIn: 'root'
})
export class AirlinesService {
  private baseUrl = 'http://localhost:3000/airlines';

  constructor(private http: HttpClient) {}

  getAirlines(): Observable<Airlines[]> {
    return this.http.get<Airlines[]>(this.baseUrl);
  }

  getAirlineById(id: string): Observable<Airlines> {
    return this.http.get<Airlines>(`${this.baseUrl}/${id}`);
  }
}