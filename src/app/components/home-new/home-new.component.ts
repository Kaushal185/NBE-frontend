import { Component } from '@angular/core';
import { CustomDatasource } from 'src/app/custom-datasource';
import { SwiftMsgService } from 'src/app/services/swift-msg.service';

@Component({
  selector: 'app-home-new',
  templateUrl: './home-new.component.html',
  styleUrls: ['./home-new.component.css']
})
export class HomeNewComponent {


  records = new CustomDatasource<any>(this.swiftMsgService);
  entities: any[] = [];
  currentPage = 0;
  pageSize = 200; // records per page
  columnsToDisplay = ['id', 'messageType', 'status', 'createdOn', 'updatedOn'];



  constructor(
    private swiftMsgService: SwiftMsgService,
  ) {   }

  ngOnInit(): void {
    // this.loadPage();
    this.loadPage();
  }

  loadPage() {
    // Initial load or call this method whenever you want to load data
    this.records.loadData();
  }

  loadMore() {
    this.records.loadData();
  }




  // loadPage(): void {
  //   this.swiftMsgService.getAllEntities(this.currentPage, this.pageSize)
  //     .subscribe(data => {
  //       console.log(data);
  //       // this.entities = data.content;
  //       console.log('DATA FETCHED')
  //     });
  // }

  loadNextPage(): void {
    this.currentPage++;
    this.loadPage();
  }

  loadPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadPage();
    }
  }


}
