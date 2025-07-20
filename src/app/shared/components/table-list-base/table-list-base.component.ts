import { DataSource } from '@angular/cdk/collections';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { AfterContentInit, ChangeDetectionStrategy, Component, booleanAttribute, input, contentChildren, contentChild, viewChild } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatColumnDef, MatHeaderRowDef, MatNoDataRow, MatRowDef, MatTable, MatTableModule } from '@angular/material/table';

@Component({
    selector: 'sia-table-list-base',
    template: '',
    imports: [MatTableModule, MatSortModule, DragDropModule, MatProgressSpinnerModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableListBaseComponent<T> implements AfterContentInit {

    readonly dataSource = input.required<DataSource<T>>();
    readonly columns = input.required<string[]>();
    readonly loading = input<boolean, unknown>(false, { transform: booleanAttribute });
    readonly hideWhenEmpty = input<boolean, unknown>(false, { transform: booleanAttribute });

    readonly headerRowDefs = contentChildren(MatHeaderRowDef);
    readonly rowDefs = contentChildren(MatRowDef);
    readonly columnDefs = contentChildren(MatColumnDef);
    readonly noDataRow = contentChild(MatNoDataRow);

    readonly table = viewChild(MatTable);

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * After content init
     */
    ngAfterContentInit(): void {
        this.columnDefs()?.forEach(columnDef => this.table().addColumnDef(columnDef));
        this.rowDefs()?.forEach(rowDef => this.table().addRowDef(rowDef));
        this.headerRowDefs()?.forEach(headerRowDef => this.table().addHeaderRowDef(headerRowDef));
        this.table().setNoDataRow(this.noDataRow());
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
        moveItemInArray(this.columns(), event.previousIndex, event.currentIndex);
    }
}
