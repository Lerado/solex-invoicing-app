import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, OnInit, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ShipmentPackagesTableListComponent } from '../../components/shipment-packages-table-list/shipment-packages-table-list.component';
import { TableListAction } from 'app/shared/components/table-list-actions/table-list-actions.types';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { PaginatedDataSource } from 'app/shared/utils/pagination.types';
import { ShipmentPackagesQueryService } from '../../services/shipment-packages-query.service';
import { fromEvent, debounceTime, distinctUntilChanged, tap, merge } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { TableListActionsComponent } from 'app/shared/components/table-list-actions/table-list-actions.component';
import { RouterLink } from '@angular/router';
import { ShipmentPackage } from 'app/core/shipment-package/shipment-package.types';

/**
 * @deprecated
 */
@Component({
    selector: 'sia-shipment-packages-list-page',
    imports: [RouterLink, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ShipmentPackagesTableListComponent, TableListActionsComponent],
    providers: [ShipmentPackagesQueryService],
    templateUrl: './shipment-packages-list-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ShipmentPackagesListPageComponent implements OnInit, AfterViewInit {
    private readonly _shipmentPackagesQueryService = inject(ShipmentPackagesQueryService);
    private readonly _destroyRef = inject(DestroyRef);


    private readonly _paginator = viewChild(MatPaginator);
    private readonly _sort = viewChild(MatSort);
    private readonly _search = viewChild<ElementRef>('searchInput');

    shipmentPackagesSource = new PaginatedDataSource<ShipmentPackage>(this._shipmentPackagesQueryService);

    shipmentPackagesLoading = toSignal(this.shipmentPackagesSource.loading$);
    shipmentPackagesCount = toSignal(this.shipmentPackagesSource.totalCount$);

    shipmentPackagesColumns: string[] = ['createdAt', 'number', 'from.city.name', 'to.city.name', 'designation', 'quantity', 'weight', 'price', 'totalPrice', 'actions'];
    shipmentPackagesActions: TableListAction[] = [
        // {
        //     key: 'details',
        //     label: 'Détails',
        //     icon: 'heroicons_outline:eye',
        //     styles: {
        //         icon: 'text-primary',
        //         button: 'bg-[#4A70FF24]'
        //     }
        // },
        // {
        //     key: 'edit',
        //     label: 'Modifier',
        //     icon: 'heroicons_outline:pencil',
        //     styles: {
        //         icon: 'text-success',
        //         button: 'bg-[#1BB27424]'
        //     }
        // },
        // {
        //     key: 'delete',
        //     label: 'Supprimer',
        //     icon: 'heroicons_outline:trash',
        //     styles: {
        //         icon: 'text-warn',
        //         button: 'bg-[#FE4B6E24]'
        //     }
        // }
    ];

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        // Load data source
        this.shipmentPackagesSource.load();
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void {

        // Server side search
        fromEvent(this._search().nativeElement, 'keyup').pipe(
            takeUntilDestroyed(this._destroyRef),
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this._paginator().pageIndex = 0;
                this._loadShipmentPackagesPage();
            })
        ).subscribe();

        // Reset paginator after sorting
        this._sort().sortChange.pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => this._paginator().pageIndex = 0);

        merge(this._sort().sortChange, this._paginator().page).pipe(
            takeUntilDestroyed(this._destroyRef),
            tap(() => this._loadShipmentPackagesPage())
        ).subscribe();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Load
     */
    private _loadShipmentPackagesPage(): void {

        const { pageIndex, pageSize } = this._paginator();
        const { active, direction } = this._sort();

        this.shipmentPackagesSource.load(
            { page: pageIndex + 1, limit: pageSize },
            { sortKey: active, sort: direction },
            this._search().nativeElement.value
        );
    }
}
