import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from '../dialog-message/dialag-message.component'

import { Customer } from '../customers';
import { Call } from '../calls';
import { CallsService } from '../calls.service';
import { CustomerService } from "../customer.service"

@Component({
  selector: 'app-call-in-use',
  templateUrl: './call-in-use.component.html',
  styleUrls: ['./call-in-use.component.css']
})
export class CallInUseComponent implements OnInit {
  customer: Customer;
  customerOriginal : Customer;
  call: Call;
  submitStatus: boolean = false;
  callForm: FormGroup;
  callIdFromRoute = 0;

  constructor(
    private route: ActivatedRoute,
    private callsService: CallsService,
    private customerService: CustomerService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {

    // First get the call id from the current route.
    const routeParams = this.route.snapshot.paramMap;
    this.callIdFromRoute = Number(routeParams.get('callId'));

    // Find the call that correspond with the id provided in route.
    this.callsService.getCall(this.callIdFromRoute).subscribe(data => {
      this.call = data;
      // Find the customer.
      this.customerService.getCustomer(this.call.customer_id).subscribe(data => {
        this.customer = data;
        this.customerOriginal = {...data};
        if(this.call.status == "COMPLETED"){
          this.createCall();
        }
      });
    });

    this.callForm = new FormGroup({
      title: new FormControl('',Validators.required),
      firstName: new FormControl('',Validators.required),
      surname: new FormControl('',Validators.required),
      mobile: new FormControl('',Validators.required),
      home: new FormControl('',Validators.required)
    });

  }

  createCall() {
    this.callsService.createCall(this.customer).subscribe(data => {
      this.call = data;
    });
  }

  updateCustomer() {
    this.call.name = this.customer.title + " " + this.customer.first_name + " " + this.customer.surname;
    this.customerService.updateCustomer(this.customer).subscribe(data => {
      this.callsService.updateCall(this.call).subscribe(data1 => {
      });
    });
    this.dialog.open(DialogMessageComponent, {
      width: '250px',
      data: { component: MessageUpdateCustomerComponent }
    });
  }

  reset() {
    this.customer = this.customerOriginal;
  }

  makeCall() {
    this.call.status = "IN USE"
    this.callsService.updateCall(this.call).subscribe(data => {
      window.location.href = 'tel:'+this.customer.mobile;
    });
  }

  completeCall() {
    // this.updateCustomer();
    this.call.status = "COMPLETED"
    this.call.name = this.customer.title + " " + this.customer.first_name + " " + this.customer.surname;
    this.callsService.updateCall(this.call).subscribe(data => {
      //done
    });
    console.warn(this.callForm.valid);
    this.router.navigate(['/']);
  }

}

@Component({
  selector: 'dynamic-comp-call',
  template: `
  <div>Customer has been updated successfully.</div>`
})
export class MessageUpdateCustomerComponent {

}