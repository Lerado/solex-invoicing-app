import { DataSource } from '@angular/cdk/collections';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, ContentChildren, Input, QueryList, ViewChild, booleanAttribute } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatColumnDef, MatHeaderRowDef, MatNoDataRow, MatRowDef, MatTable, MatTableModule } from '@angular/material/table';

@Component({
    selector: 'table-list-base',
    template: '',
    standalone: true,
    imports: [MatTableModule, MatSortModule, DragDropModule, MatProgressSpinnerModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableListBaseComponent<T> implements AfterContentInit {

    @Input({ required: true }) dataSource: DataSource<T>;
    @Input({ required: true }) columns: string[];
    @Input({ transform: booleanAttribute }) loading: boolean = false;
    @Input({ transform: booleanAttribute }) hideWhenEmpty: boolean = false;

    @ContentChildren(MatHeaderRowDef) headerRowDefs: QueryList<MatHeaderRowDef>;
    @ContentChildren(MatRowDef) rowDefs: QueryList<MatRowDef<T>>;
    @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;
    @ContentChild(MatNoDataRow) noDataRow: MatNoDataRow;

    @ViewChild(MatTable, { static: true }) table: MatTable<T>;

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * After content init
     */
    ngAfterContentInit(): void {
        this.columnDefs?.forEach(columnDef => this.table.addColumnDef(columnDef));
        this.rowDefs?.forEach(rowDef => this.table.addRowDef(rowDef));
        this.headerRowDefs?.forEach(headerRowDef => this.table.addHeaderRowDef(headerRowDef));
        this.table.setNoDataRow(this.noDataRow);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Move column in table
     *
     * @param event
     */
    moveColumn(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    }
}
