import { Component, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { MsgDataService } from 'src/app/services/msg-data.service';
import { SearchQueryService } from 'src/app/services/search-query.service';
import { SwiftMsgService } from 'src/app/services/swift-msg.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MsgTraceService } from 'src/app/services/msg-trace.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  // for loading spinner
  loading: boolean = true;
  notFound: boolean = false;
  // loadDisable: boolean = true;
  searchQueryAdded: boolean = false; //sets to true if we have performerd a filtered search

  records: MatTableDataSource<any> = new MatTableDataSource<any>();
  columnsToDisplay = ['id', 'reference', 'messageType', 'identifier', 'status', 'createdOn', 'updatedOn', 'view'];

  searchId!: number;
  selectedId: any;
  currentPage = 0;
  totalPages = 1;
  pageSize = 15;
  notFoundMessage = '';
  selectedMessageTypeFilter = 'MX';
  messageType = 'MX';
  fromDate = '';
  toDate = '';
  identifier = '';
  status = '';
  saveStateOn = false;
  dataArray = [];
  refNumber: string = '';
  fromDateRange: string = "";
  toDateRange: string = "";
  minEndDateRange: string = "";
  maxEndDateRange: string = "";

  // onDateChange(): void {
  //   console.log('Selected date:', this.toDate);
  // }

  // define customeFilterPredicate to only apply to ID column
  customFilterPredicate(data: any, filter: string): boolean {
    return data.id.toString().toLowerCase().includes(filter);
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private swiftMsgService: SwiftMsgService,
    private router: Router,
    private msgDataService: MsgDataService,
    private SQS: SearchQueryService,
    private msgTraceService: MsgTraceService
  ) { }

  ngOnInit(): void {
    console.log('NG-ONINIT');
    if (this.SQS.savedStateOn) {

      this.currentPage = this.SQS.currentPage;
      this.totalPages = this.SQS.totalPages;
      this.pageSize = this.SQS.pageSize;
      this.messageType = this.SQS.messageType;
      this.status = this.SQS.status;
      this.identifier = this.SQS.identifier;
      this.fromDate = this.SQS.fromDate;
      this.toDate = this.SQS.toDate;
      this.getQueryData();

    } else {
      this.loadInitialPage();
    }
  }

  // ngAfterViewInit() {
  //   this.records.paginator = this.paginator;
  //   this.records.sort = this.sort;
  //   this.records.filterPredicate = this.customFilterPredicate.bind(this);

  //   console.log('NG-AFTERVIEWINIT');
  // }

  // loadSearchedData(): void {
  //   this.swiftMsgService.getAllRecords()
  //     .subscribe(data => {
  //       console.log(data);
  //       this.records.data = data;
  //       this.loading = false;
  //       console.log('DATA FETCHED: Home.loadData()');
  //     });
  // }

  loadInitialPage(): void {
    this.records.data = [];
    this.loading = true;
    this.notFound = false;

    this.swiftMsgService.getAllEntities(this.currentPage, this.pageSize, this.messageType)
      .subscribe(
        (response) => {
          console.log('Loading data for page:', this.currentPage);
          console.log('Received data:', response);
          console.log(response.totalPages);
          this.records.data = response.content;
          this.totalPages = response.totalPages;
          this.notFound = false;
          this.loading = false;
        },
        (error) => {
          console.error('Error loading more data:', error);
          console.log(error);
          if (error.status === 404) {
            this.notFoundMessage = error.error;
          }
          this.notFoundMessage = "Connection Error, please check connection.";
          this.loading = false;
          this.notFound = true;
          // this.records.data = [];

        }
      );
  }

  // loadMore() {
  //   this.loading = true;
  //   this.loadInitialPage();
  // }

  getQueryData(): void {
    this.searchQueryAdded = true;
    // console.log(this.identifier);
    // console.log(this.status);
    // console.log(this.fromDate);
    // console.log(this.toDate);
    // console.log(this.messageType);
    this.loading = true;
    this.notFound = false;

    this.swiftMsgService.getQueryData(this.currentPage, this.pageSize, this.messageType, this.identifier, this.status, this.fromDate, this.toDate).subscribe(
      (response) => {
        console.log(this.records.data);
        this.records.data = [];
        this.records.data = response.content;
        this.totalPages = response.totalPages;
        this.notFound = false;
        this.loading = false;
        console.log(response);
      },

      (error) => {
        console.log(error);
        if (error.status === 404) {
          this.notFoundMessage = error.error;
        }
        this.notFound = true;
        this.records.data = [];
        this.loading = false;
        console.log(this.notFoundMessage);
      }
    );
  }

  loadFirstPage(): void {
    if (this.currentPage !== 0) {
      this.currentPage = 0;
      if (this.searchQueryAdded) this.getQueryData();
      else this.loadInitialPage();
    }
  }

  loadNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      if (this.searchQueryAdded) this.getQueryData();
      else this.loadInitialPage();
    }
  }

  loadPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      if (this.searchQueryAdded) this.getQueryData();
      else this.loadInitialPage();
    }
  }

  loadLastPage(): void {
    if (this.currentPage !== this.totalPages - 1) {
      this.currentPage = this.totalPages - 1;
      if (this.searchQueryAdded) this.getQueryData();
      else this.loadInitialPage();
    }
  }

  openMessage(id: any): void {
    this.SQS.savedStateOn = true;
    this.SQS.currentPage = this.currentPage;
    this.SQS.totalPages = this.totalPages;
    this.SQS.pageSize = this.pageSize;
    this.SQS.messageType = this.messageType;
    this.SQS.status = this.status;
    this.SQS.identifier = this.identifier;
    this.SQS.fromDate = this.fromDate;
    this.SQS.toDate = this.toDate;
    this.msgDataService.setSelectedId(id);
    this.router.navigate([`dashboard/${id}/message`]);
  }

  openHistory(id: any): void {
    this.SQS.savedStateOn = true;
    this.SQS.currentPage = this.currentPage;
    this.SQS.totalPages = this.totalPages;
    this.SQS.pageSize = this.pageSize;
    this.SQS.messageType = this.messageType;
    this.SQS.status = this.status;
    this.SQS.identifier = this.identifier;
    this.SQS.fromDate = this.fromDate;
    this.SQS.toDate = this.toDate;
    this.msgTraceService.setSelectedId(id);
    this.router.navigate([`dashboard/${id}/history`]);
  }

  search(id: any) {
    this.loading = true;
    this.swiftMsgService.searchRecord(id).subscribe(
      (data) => {
        console.log("data");
        console.log(data);
        this.records.data = [data];
        this.loading = false;
        this.notFound = false;
      },
      (error) => {
        if (error.status === 404) {
          this.notFoundMessage = error.error;
        }
        if (error.status === 400) {
          this.notFoundMessage = "Please enter valid ID or click clear."
        }
        this.notFound = true;
        this.records.data = [];
        this.loading = false;
        console.log("error");
        console.log(error.error);
      }
    )
  }

  clear() {
    // this.loadDisable = false;
    // this.notFound = false;
    // this.records.data = [];
    // this.currentPage = 0;
    // this.loading = true;
    // this.loadInitialPage();
    this.getSelectedMessageType(this.messageType);
  }

  getSelectedMessageType(messageType: string) {
    this.searchQueryAdded = false;
    // console.log(messageType);
    this.messageType = messageType;
    this.fromDate = '';
    this.toDate = '';
    this.identifier = '';
    this.status = '';
    // this.loading = true;
    this.currentPage = 0;
    this.loadInitialPage();
  }

  downloadExcel(): void {
    const fileName = 'table_data.xlsx';
    const recordsElement = document.getElementById('records'); // Original table element
    if (recordsElement) {
      // Clone the table element
      const clonedTable = recordsElement.cloneNode(true) as HTMLElement;
      // Remove the last column from the cloned table
      const rows = clonedTable.querySelectorAll('tr');
      rows.forEach(row => {
        const lastCell = row.querySelector('td:last-child, th:last-child');
        if (lastCell) {
          lastCell.remove();
        }
      });
      // Create a new workbook
      const wb: XLSX.WorkBook = XLSX.utils.table_to_book(clonedTable);
      // Convert the workbook to a binary string
      const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      // Save the file using file-saver
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fileName);
      // Restore the original table element after exporting
      // recordsElement.parentElement?.replaceChild(clonedTable, recordsElement);
    } else {
      console.error("Unable to find records element");
    }
  }
  async convertArrayToExcel(): Promise<void> {
    try {
      await this.getFilterForListToExcel(); // Wait for getFilterForListToExcel to complete
      // for(let i=0;i<this.dataArray.length;i++){
      //   const dataWithoutMessage = this.dataArray[i].map(item => {
      //     const { message, ...rest } = item; // Destructure 'message' and collect the rest of the properties
      //     return rest; // Return the object without the 'message' field
      // });
      // }
      // Create a new workbook for downloading all records.
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      // Create a new worksheet from the array data
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataArray);
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      // Convert the workbook to a binary string
      const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      // Save the file using file-saver
      saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'data.xlsx');
    } catch (error) {
      console.error('Error converting array to Excel:', error);
    }
  }

  async getFilterForListToExcel(): Promise<void> {
    try {
      const response = await this.swiftMsgService.getFilterForListToExcel(this.messageType, this.identifier, this.status, this.fromDate, this.toDate).toPromise();
      this.dataArray = response;
      console.log(response);
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error; // Propagate the error if necessary
    }
  }


  export(selectedValue: string): void {
    if (selectedValue == 'page') {
      this.downloadExcel();
    }
    else {
      this.convertArrayToExcel();
    }
  }
  updateMinEndDateRange() {
    this.toDate = "";
    if (this.fromDate) {
      const startDate = new Date(this.fromDate);
      const minEndDate = new Date(startDate);
      minEndDate.setDate(startDate.getDate() + 1); // Adding 1 day to start date
      this.minEndDateRange = this.formatDate(minEndDate); // Set minimum end date
    } else {
      this.minEndDateRange = ""; // Reset minimum end date if no start date selected
    }
  }

  updateMaxEndDateRange() {
    if (this.fromDate) {
      const startDate = new Date(this.fromDate);
      const maxEndDate = new Date(startDate);
      maxEndDate.setDate(startDate.getDate() + 2); // Adding 5 days to start date
      this.maxEndDateRange = this.formatDate(maxEndDate); // Set maximum end date
    } else {
      this.maxEndDateRange = ""; // Reset maximum end date if no start date selected
    }
  }

  updateToDateRange() {
    this.updateMinEndDateRange();
    this.updateMaxEndDateRange();
  }

  formatDate(date: Date): string {
    const mm = date.getMonth() + 1; // getMonth() is zero-based
    const dd = date.getDate();
    return [date.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
    ].join('-');
  }

  searchByReference(reference: string) {
    // const id = 'qwerty12'; static value to test
    console.log('search');
    this.loading = true;
    this.notFound = false;

    this.swiftMsgService.searchRecord(reference).subscribe(
      response => {
        console.log(response);
        this.records.data = [response];
        this.loading = false;
        this.notFound = false;
      },
      error => {
        console.log(error);
        if (error.status === 404) {
          this.notFoundMessage = error.error;
        }
        this.notFound = true;
        this.records.data = [];
        this.loading = false;
        console.log(this.notFoundMessage);

      }
    )
  }

  pageSizeChange() {
    if(this.searchQueryAdded){
      this.getQueryData();
    } else {
      this.loadInitialPage();
    }

  }

}
