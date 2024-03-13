import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MsgTraceService {


  private selectedIdKey = 'selectedId';

  private apiUrl = 'http://localhost:8090/api/msg-trace';

  constructor(
    private http: HttpClient
  ) { }

  setSelectedId(id: any): void {
    sessionStorage.setItem(this.selectedIdKey, id);
  }

  getMessageHistory(): Observable<any> {
    const selectedId = sessionStorage.getItem(this.selectedIdKey);
    const url = `${this.apiUrl}/history?id=${selectedId}`
    return this.http.get(url);
  }
}

