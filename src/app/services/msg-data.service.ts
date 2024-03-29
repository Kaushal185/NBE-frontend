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
    sessionStorage.setItem(this.selectedIdKey, id);
  }

  getSelectedIdMessages(): Observable<any> {
    const selectedId = sessionStorage.getItem(this.selectedIdKey);
    const url = `${this.apiUrl}/${selectedId}`
    return this.http.get(url);
  }

}
