import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MsgDataService {

  selectedId: number = 0;


  private apiUrl = 'http://localhost:8090/api/msg-relations';

  constructor(
    private http: HttpClient
  ) { }


  setSelectedId(id: any): any {
    this.selectedId = id;
  }

  getSelectedId(): any {
    return this.selectedId;
  }

  getSelectedIdMessages(): Observable<any> {
    const url = `${this.apiUrl}/${this.selectedId}`
    return this.http.get(url);
  }

  postSelectedMessage(): Observable<any> {
    const url = `${this.apiUrl}/id`;
    const requestBody = { id: this.selectedId }; // Shorthand for { id: id }
    return this.http.post(url, requestBody);
  }


}
