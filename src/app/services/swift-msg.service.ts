import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SwiftMsgService {

  private apiUrl = 'http://localhost:8090/api/swift'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

  getAllRecords(): Observable<any> {
    const url = `${this.apiUrl}/all`;
    return this.http.get(url);
  }

  // Paginated data
  getAllEntities(page: number, size: number, messageType: string): Observable<any> {
        const url = `${this.apiUrl}/initialPage?page=${page}&pageSize=${size}&messageType=${messageType}`;
        return this.http.get(url);
  }

  // load button functionality
  getMoreRecords(page: number): Observable<any> {
    const url = `${this.apiUrl}/loadMore?page=${page}`;
    return this.http.get(url);
  }

  searchRecord(id: any): Observable<any> {
    const url = `${this.apiUrl}/search?id=${id}`;
    return this.http.get(url);
  }

  getQueryData(page: number, size: number, messageType:string, identifier: string, status: string, from: string, to: string): Observable<any>{
    const url = `${this.apiUrl}/search?messageType=${messageType}&identifier=${identifier}&status=${status}&from=${from}&to=${to}&page=${page}&pageSize=${size}`;
    return this.http.get(url);
  }

  getFilterForListToExcel(messageType:string, identifier: string, status: string, from: string, to: string): Observable<any>{
    const url = `${this.apiUrl}/filtered?messageType=${messageType}&identifier=${identifier}&status=${status}&from=${from}&to=${to}`;
    return this.http.get(url);
  }

}

