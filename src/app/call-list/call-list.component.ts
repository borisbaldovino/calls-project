import { Component, OnInit } from '@angular/core';
import { CallsService } from '../calls.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogMessageComponent } from '../dialog-message/dialag-message.component'
import { Router } from '@angular/router';
import { Call } from '../calls';
import * as _moment from 'moment';

const moment = _moment;

@Component({
  selector: 'app-call-list',
  templateUrl: './call-list.component.html',
  styleUrls: ['./call-list.component.css']
})
export class CallListComponent implements OnInit {
  calls: Call[] = [];

  displayedColumns: string[] = ['name', 'date_sold', 'status'];
  dataSource = new MatTableDataSource();
  filterValues = {};
  filterSelectObj = [] as any;
  selectedRow;

  constructor(private callsService: CallsService, private router: Router, public dialog: MatDialog) {
    // Object to create filter for datatable
    this.filterSelectObj = [
      {
        name: 'Type',
        columnProp: 'type',
        options: []
      }, {
        name: 'Date Sold',
        columnProp: 'date_sold',
        options: []
      }, {
        name: 'Status',
        columnProp: 'status',
        options: []
      }
    ]
  }

  ngOnInit() {
    this.getCalls();
  }

  getCalls(){
    this.callsService.getCalls().subscribe(data => {
      this.calls = data;

      this.dataSource.data = this.calls;

      this.filterSelectObj.filter((o) => {
        o.options = this.getFilterObject(this.calls, o.columnProp);
      });

      // Overrride default filter behaviour of Material Datatable
      this.dataSource.filterPredicate = this.createFilter();
    });
  }

  makeCall(){
    if(this.selectedRow)
      this.router.navigate(['/call-in-use', this.selectedRow.id ]);
    else
      this.dialog.open(DialogMessageComponent, {
        width: '250px',
        data: { component: MessageSelectCallComponent }
      });
  }

  // Get Unique values from columns to build filter
  getFilterObject(fullObj, key) {
    const uniqChk = [] as any;
    fullObj.filter((obj) => {
      if (!uniqChk.includes(obj[key])) {
        uniqChk.push(obj[key]);
      }
      return obj;
    });
    return uniqChk;
  }

  // Called on a filter change
  filterChange(filter, event) {
    console.log(event.target.value);
    this.filterValues[filter.columnProp] = event.target.value.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  // Called on a date filter change
  dateFilterChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    this.filterValues['date_sold'] = {start_date: dateRangeStart.value, end_date: dateRangeEnd.value}
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  // Custom filter for datatable
  createFilter() {
    return (data: any, filter: string) => {
      let searchTerms = JSON.parse(filter);

      let isFilterSet = false;
      for (const col in searchTerms) {
        if (searchTerms[col].toString() !== '') {
          isFilterSet = true;
        } else {
          delete searchTerms[col];
        }
      }

      const matchFilter = [] as any;

      const filterType = searchTerms['type'];
      const filterDateSold = searchTerms['date_sold'];
      const filterStatus = searchTerms['status'];

      const columnType = data['type'];
      const columnDateSold = data['date_sold'];
      const columnStatus = data['status'];

      let customFilterDS = false;
      const customFilterT = columnType.toLowerCase().includes(filterType);
      if(filterDateSold){
        customFilterDS = 
          moment(columnDateSold, "DD/MM/YYYY").isBetween(
            moment(filterDateSold.start_date, "M/D/YYYY"),moment(filterDateSold.end_date, "M/D/YYYY"));
      }
      
      
      const customFilterS = columnStatus.toLowerCase().includes(filterStatus);

      // push matches if they exist
      if(filterType) matchFilter.push(customFilterT);
      if(filterDateSold) matchFilter.push(customFilterDS);
      if(filterStatus) matchFilter.push(customFilterS);

      // return true if all values are true else return false
      return matchFilter.every(Boolean);

    }
  }

  // Reset table filters
  // resetFilters() {
  //   this.filterValues = {}
  //   this.filterSelectObj.forEach((value, key) => {
  //     value.modelValue = undefined;
  //   })

  //   this.dataSource.filter = "";
  // }
}

@Component({
  selector: 'dynamic-comp',
  template: `
  <div>Please select a call first.</div>`
})
export class MessageSelectCallComponent {

}