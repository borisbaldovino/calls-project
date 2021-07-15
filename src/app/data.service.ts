import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Call } from './calls';
import { Customer } from './customers';

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService{
  constructor() { }
  createDb() {
    const customers: Customer[] = [
      {
        id: 1,
        title: 'Mr',
        first_name: 'Giaccono',
        surname: 'Guilizzoni',
        mobile: '(04) 444444444',
        home: '(03) 333333333'
      },
      {
        id: 2,
        title: 'Ms',
        first_name: 'Patricia',
        surname: 'Hogema',
        mobile: '(04) 444444444',
        home: '(03) 333333333'
      },
      {
        id: 3,
        title: 'Miss',
        first_name: 'Valerie',
        surname: 'Liberty',
        mobile: '(04) 444444444',
        home: '(03) 333333333'
      },
      {
        id: 4,
        title: 'Mrs',
        first_name: 'Mariah',
        surname: 'Maclachlan',
        mobile: '(04) 444444444',
        home: '(03) 333333333'
      }
    ];

    const calls: Call[] = [
      {
        id: 1,
        customer_id: 1,
        name: 'Mr Giaccono Guilizzoni',
        date_sold: '12/07/2021',
        status: 'IN USE',
        type: 'Sales'
      },
      {
        id: 2,
        customer_id: 2,
        name: 'Ms Patricia Hogema',
        date_sold: '04/06/2021',
        status: 'COMPLETED',
        type: 'Service'
      },
      {
        id: 3,
        customer_id: 3,
        name: 'Miss Valerie Liberty',
        date_sold: '04/05/2021',
        status: 'NEW',
        type: 'Sales'
      },
      {
        id: 4,
        customer_id: 4,
        name: 'Mrs Mariah Maclachlan',
        date_sold: '11/07/2021',
        status: 'NEW',
        type: 'Service'
      }
    ];

    return {customers, calls};
  };
}
