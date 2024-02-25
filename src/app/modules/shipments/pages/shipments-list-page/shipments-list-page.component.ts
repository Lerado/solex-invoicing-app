import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ShipmentsTableListComponent } from '../../components/shipments-table-list/shipments-table-list.component';
import { TableListAction } from 'app/shared/components/table-list-actions/table-list-actions.types';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { PaginatedDataSource } from 'app/shared/utils/pagination.types';
import { Shipment } from 'app/core/shipment/shipment.types';
import { ShipmentsQueryService } from '../../services/queried-shipments.service';
import { fromEvent, debounceTime, distinctUntilChanged, tap, merge } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { TableListActionsComponent } from 'app/shared/components/table-list-actions/table-list-actions.component';

@Component({
    selector: 'sia-shipments-list-page',
    standalone: true,
    imports: [MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ShipmentsTableListComponent, TableListActionsComponent],
    providers: [ShipmentsQueryService],
    templateUrl: './shipments-list-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipmentsListPageComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) private readonly _paginator: MatPaginator;
    @ViewChild(MatSort) private readonly _sort: MatSort;
    @ViewChild('searchInput') private readonly _search: ElementRef;

    shipmentsSource = new PaginatedDataSource<Shipment>(this._shipmentsQueryService);

    shipmentsLoading = toSignal(this.shipmentsSource.loading$);
    shipmentsCount = toSignal(this.shipmentsSource.totalCount$);

    shipmentsColumns: string[] = ['id', 'createdAt', 'number', 'from.city.name', 'to.city.name', 'designation', 'quantity', 'weight', 'price', 'totalPrice', 'actions'];
    shipmentsActions: TableListAction[] = [
        {
            key: 'details',
            label: 'Show details',
            icon: 'heroicons_outline:eye',
            styles: {
                icon: 'text-primary',
                button: 'bg-[#4A70FF24]'
            }
        },
        {
            key: 'edit',
            label: 'Edit',
            icon: 'heroicons_outline:pencil',
            styles: {
                icon: 'text-success',
                button: 'bg-[#1BB27424]'
            }
        },
        {
            key: 'delete',
            label: 'Delete',
            icon: 'heroicons_outline:trash',
            styles: {
                icon: 'text-warn',
                button: 'bg-[#FE4B6E24]'
            }
        }
    ];

    /**
     * Constructor
     */
    constructor(
        private readonly _shipmentsQueryService: ShipmentsQueryService,
        private readonly _destroyRef: DestroyRef
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        // Load data source
        this.shipmentsSource.load();
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {

        // Server side search
        fromEvent(this._search.nativeElement, 'keyup').pipe(
            takeUntilDestroyed(this._destroyRef),
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this._paginator.pageIndex = 0;
                this._loadShipmentsPage();
            })
        ).subscribe();

        // Reset paginator after sorting
        this._sort.sortChange.pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => this._paginator.pageIndex = 0);

        merge(this._sort.sortChange, this._paginator.page).pipe(
            takeUntilDestroyed(this._destroyRef),
            tap(() => this._loadShipmentsPage())
        ).subscribe();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Load shipments
     */
    private _loadShipmentsPage(): void {

        const { pageIndex, pageSize } = this._paginator;
        const { active, direction } = this._sort;

        this.shipmentsSource.load(
            { page: pageIndex + 1, limit: pageSize },
            { sortKey: active, sort: direction },
            this._search.nativeElement.value
        );
    }
}
