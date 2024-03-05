import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MsgDataService {

  private selectedIdKey = 'selectedId';


  private apiUrl = 'http://localhost:8090/api/msg-relations';

  constructor(
    private http: HttpClient
  ) { }


  setSelectedId(id: any): void {
    // this.selectedId = id;
    localStorage.setItem(this.selectedIdKey, id);
  }

  // getSelectedId(): any {
  //   return this.selectedId;
  // }

  getSelectedIdMessages(): Observable<any> {
    const selectedId = localStorage.getItem(this.selectedIdKey);
    const url = `${this.apiUrl}/${selectedId}`
    return this.http.get(url);
  }

  // postSelectedMessage(): Observable<any> {
  //   const url = `${this.apiUrl}/id`;
  //   const requestBody = { id: this.selectedId }; // Shorthand for { id: id }
  //   return this.http.post(url, requestBody);
  // }


}
