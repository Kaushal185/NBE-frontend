import { DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';
import { SwiftMsgService } from './services/swift-msg.service';

export class CustomDatasource<T> extends DataSource<T> {
  private dataSubject = new BehaviorSubject<T[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private currentPage = 0; // Initialize page number

  public loading$ = this.loadingSubject.asObservable();

  constructor(private swiftMsgService: SwiftMsgService) {
    super();
  }

  connect(): Observable<T[]> {
    return this.dataSubject.asObservable();
  }

  disconnect() {
    this.dataSubject.complete();
    this.loadingSubject.complete();
  }

  loadData() {
    this.loadingSubject.next(true);

    this.swiftMsgService.getMoreRecords(this.currentPage)
      .subscribe(
        (newData: any) => {
          console.log('Loading data for page:', this.currentPage);
          console.log('Received data:', newData);
          const currentData = this.dataSubject.value;
          this.dataSubject.next([...currentData, ...newData.content]);
          this.loadingSubject.next(false);
          this.currentPage++; // Increment page after loading data
        },
        (error) => {
          console.error('Error loading more data:', error);
          this.loadingSubject.next(false);
        }
      );
  }
}
