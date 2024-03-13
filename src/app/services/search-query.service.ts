import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchQueryService {

  currentPage = 0;
  totalPages = 1;
  pageSize = 15;
  messageType = 'MX';
  fromDate = '';
  toDate = '';
  identifier = '';
  status = '';
  savedStateOn = false;


  constructor() { }
}
