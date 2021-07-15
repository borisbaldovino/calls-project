import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap, map } from 'rxjs/operators';
import { Customer } from './customers';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customersUrl = 'api/customers';
  headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
  httpOptions = {
    headers: this.headers
  };

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error(error);
    return throwError(error);
  }

  // getCustomers(): Observable<Customer[]> {
  //   return this.http.get<Customer[]>(this.customersUrl).pipe(
  //     retry(2),
  //     catchError((error: HttpErrorResponse) => {
  //       console.error(error);
  //       return throwError(error);
  //     })
  //   );
  // }

  getCustomer(id: number): Observable<Customer> {
    const url = `${this.customersUrl}/${id}`;
    return this.http.get<Customer>(url).pipe(
      catchError(this.handleError)
    );
  }

  updateCustomer(customer: Customer): Observable<Customer>{
    const url = `${this.customersUrl}/${customer.id}`;
    return this.http.put<Customer>(this.customersUrl, customer, this.httpOptions).pipe(
      map(() => customer),
      catchError(this.handleError)
    );
  }

  // createCustomer(customer: Customer): Observable<Customer> {
  //   customer.id = null;
  //   return this.http.post<Customer>(this.customersUrl, customer).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       console.error(error);
  //       return throwError(error);
  //     })
  //   )
  // }

  

  // deleteCustomer(id: number): Observable<any> {
  //   return this.http.delete(this.customersUrl + id);
  // }

}
