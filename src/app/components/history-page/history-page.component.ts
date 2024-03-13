import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MsgTraceService } from 'src/app/services/msg-trace.service';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent {

  history: MatTableDataSource<any> = new MatTableDataSource<any>();
  loading: boolean = true;

  columnsToDisplay = ['id', 'swiftMsgId', 'status', 'createdOn', 'comments'];

  constructor ( private msgTraceService: MsgTraceService ) {}

  ngOnInit() {
    this.getMessageHistory();
  }

  getMessageHistory() {
    this.msgTraceService.getMessageHistory().subscribe(
      response => {
        console.log(response);
        this.history = response;
      },
      error => {}
    )
  }

  goBack(): void {
    sessionStorage.clear();
    window.history.back();
  }
}
