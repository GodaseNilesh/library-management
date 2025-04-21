import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() pageSize: number = 5;
  @Input() columns: { columnDef: string; header: string }[] = [];

  @Output() onEdit: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDetails: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];

  ngOnInit(): void {
    this.dataSource.data = this.data;
    this.displayedColumns = this.columns.map((c) => c.columnDef);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      this.dataSource.data = changes['data'].currentValue;
    }
    if (changes['pageSize'] && changes['pageSize'].currentValue) {
      this.pageSize = changes['pageSize'].currentValue;
    }
  }

  ngAfterViewInit() {
    this.pageSize = this.pageSize;
    this.dataSource.paginator = this.paginator;
  }
  onEditClicked(element: any) {
    this.onEdit.emit(element);
    console.log(element);
  }

  onDelete(element: any) {}

  onDetailsClicked(element: any) {
    this.onDetails.emit(element);
    console.log(element);
  }
}
