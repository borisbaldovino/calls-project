import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Call } from './calls';
import { Customer } from './customers';
import * as _moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class CallsService {
  private callsUrl = 'api/calls';
  headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
  httpOptions = {
    headers: this.headers
  };

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error(error);
    return throwError(error);
  }

  getCall(id: number): Observable<Call> {
    const url = `${this.callsUrl}/${id}`;
    return this.http.get<Call>(url).pipe(
      catchError(this.handleError)
    );
  }

  getCalls(): Observable<Call[]> {
    return this.http.get<Call[]>(this.callsUrl).pipe(
      tap(data => console.log(data)),
      catchError(this.handleError)
    );
  }

  createCall(customer: Customer): Observable<Call> {
    const moment = _moment;
    const call: Call = {
      id: null as any,
      customer_id: customer.id,
      name: customer.title + " " + customer.first_name + " " + customer.surname,
      date_sold: moment().format('DD/MM/YYYY'),
      status: 'NEW',
      type: 'Sales'
    };
    return this.http.post<Call>(this.callsUrl, call, this.httpOptions).pipe(
      tap(data => console.log(data)),
      catchError(this.handleError)
    );
  }

  updateCall(call: Call): Observable<Call>{
    const url = `${this.callsUrl}/${call.id}`;
    return this.http.put<Call>(this.callsUrl, call, this.httpOptions).pipe(
      map(() => call),
      catchError(this.handleError)
    );
  }

}
