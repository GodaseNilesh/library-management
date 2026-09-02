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
export class TableComponent<T> {
  @Input() data: T[] = [];
  @Input() pageSize: number = 5;
  @Input() columns: { columnDef: string; header: string }[] = [];
  @Input() showPagination: boolean = true;
  @Input() tableName: String = '';

  @Output() onEdit= new EventEmitter<T>();
  @Output() onDetails= new EventEmitter<T>();
  @Output() onDelete= new EventEmitter<T>();
  @Output() onApprove= new EventEmitter<T>();
  @Output() onReject= new EventEmitter<T>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<T>();
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
    console.log(this.dataSource.data)
  }

  ngAfterViewInit() {
    this.pageSize = this.pageSize;
    this.dataSource.paginator = this.paginator;
  }
  onEditClicked(element: T) {
    this.onEdit.emit(element);
  }

  onDeleteClicked(element: T) {
    this.onDelete.emit(element);
  }

  onDetailsClicked(element: T) {
    this.onDetails.emit(element);
  }

  onApproveClicked(element: T) {
    this.onApprove.emit(element);
  }

  onRejectClicked(element: T) {
    this.onReject.emit(element);
  }

  onRemoveClicked(element: T) {
    this.onReject.emit(element);
  }

  onAddClicked(element: T) {
    this.onApprove.emit(element);
  }
}
