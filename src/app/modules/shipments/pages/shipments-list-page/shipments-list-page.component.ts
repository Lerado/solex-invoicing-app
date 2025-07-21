import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, OnInit, WritableSignal, inject, signal, viewChild } from '@angular/core';
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
import { ShipmentsQueryService } from '../../services/shipments-query.service';
import { fromEvent, debounceTime, distinctUntilChanged, tap, merge, lastValueFrom, map } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { TableListActionsComponent } from 'app/shared/components/table-list-actions/table-list-actions.component';
import { Router, RouterLink } from '@angular/router';
import { Shipment } from 'app/core/shipment/shipment.types';
import { FuseAlertType } from '@fuse/components/alert';
import { ShipmentService } from 'app/core/shipment/shipment.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';

export enum ShipmentListPageAction {
    Print = 'print',
    Edit = 'edit',
    Delete = 'delete'
}

@Component({
    selector: 'sia-shipments-list-page',
    imports: [RouterLink, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ShipmentsTableListComponent, TableListActionsComponent],
    providers: [ShipmentsQueryService],
    templateUrl: './shipments-list-page.component.html',
    styles: ':host { display: block;}',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ShipmentsListPageComponent implements OnInit, AfterViewInit {

    private readonly _shipmentService = inject(ShipmentService);
    private readonly _shipmentsQueryService = inject(ShipmentsQueryService);
    private readonly _fuseConfirmationService = inject(FuseConfirmationService);
    private readonly _router = inject(Router);
    private readonly _destroyRef = inject(DestroyRef);

    private readonly _paginator = viewChild(MatPaginator);
    private readonly _sort = viewChild(MatSort);
    private readonly _search = viewChild<ElementRef>('searchInput');

    shipmentsSource = new PaginatedDataSource<Shipment>(this._shipmentsQueryService);

    shipmentsLoading = toSignal(this.shipmentsSource.loading$);
    shipmentsCount = toSignal(this.shipmentsSource.totalCount$);

    shipmentsColumns: string[] = ['createdAt', 'number', 'from', 'to', 'destination', 'itemsCount', 'finalWeight', 'totalPrice', 'actions'];
    shipmentsActions: TableListAction<ShipmentListPageAction>[] = [
        {
            key: ShipmentListPageAction.Print,
            label: 'Imprimer',
            icon: 'heroicons_outline:printer',
            styles: {
                icon: 'text-primary',
                button: 'bg-[#4A70FF24]'
            }
        },
        // {
        //     key: 'details',
        //     label: 'Détails',
        //     icon: 'heroicons_outline:eye',
        //     styles: {
        //         icon: 'text-primary',
        //         button: 'bg-[#4A70FF24]'
        //     }
        // },
        {
            key: ShipmentListPageAction.Edit,
            label: 'Modifier',
            icon: 'heroicons_outline:pencil',
            styles: {
                icon: 'text-success',
                button: 'bg-[#1BB27424]'
            }
        },
        {
            key: ShipmentListPageAction.Delete,
            label: 'Supprimer',
            icon: 'heroicons_outline:trash',
            styles: {
                icon: 'text-warn',
                button: 'bg-[#FE4B6E24]'
            }
        }
    ];

    alert: WritableSignal<{ type: FuseAlertType; message: string }> = signal({
        type: 'success',
        message: '',
    });

    showAlert = signal(false);

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

        this._sort().sort({
            id: 'id',
            start: 'desc',
            disableClear: false
        });

        // Server side search
        fromEvent(this._search().nativeElement, 'keyup').pipe(
            takeUntilDestroyed(this._destroyRef),
            debounceTime(150),
            distinctUntilChanged(),
            tap(() => {
                this._paginator().pageIndex = 0;
                this._loadShipmentsPage();
            })
        ).subscribe();

        // Reset paginator after sorting
        this._sort().sortChange.pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => this._paginator().pageIndex = 0);

        merge(this._sort().sortChange, this._paginator().page).pipe(
            takeUntilDestroyed(this._destroyRef),
            tap(() => this._loadShipmentsPage())
        ).subscribe();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Handle triggered table actions
     *
     * @param actionType
     * @param subject
     */
    async handleAction(actionType: string, subject: Shipment): Promise<void> {
        switch (actionType) {
            case 'print':
                this._router.navigate(['/shipments', subject.number, 'print']);
                break;
            case ShipmentListPageAction.Edit:
                this._router.navigate(['/shipments', 'edit', subject.id]);
                break;
            case ShipmentListPageAction.Delete:
                const actionConfirmed = await this._askForConfirmation();
                if (actionConfirmed) {
                    this._deleteShipment(subject);
                }
            default:
                break;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Load
     */
    private _loadShipmentsPage(): void {

        const { pageIndex, pageSize } = this._paginator();
        const { active, direction } = this._sort();

        this.shipmentsSource.load(
            { page: pageIndex + 1, limit: pageSize },
            { sortKey: active, sort: direction },
            this._search().nativeElement.value
        );
    }

    /**
     * Deletes a shipment
     * @param {Shipment} shipment
     */
    private _deleteShipment(shipment: Shipment): void {
        this._shipmentService.delete(shipment.id).subscribe({
            // Load the same page
            next: () => this._loadShipmentsPage(),
            error: (message) => {

                // Set the alert
                this.alert.set({
                    type: 'error',
                    message
                });

                // Show the alert
                this.showAlert.set(true);
            },
        });
    }

    /**
     * Double check user consent to perform a critical action
     *
     * @returns {Promise<boolean>} A `Promise` returning true if the action was confirmed, false otherwise.
     */
    private _askForConfirmation(): Promise<boolean> {

        const confirmationDialog = this._fuseConfirmationService.open({
            message: 'Cette action ne peut être annulée et est irréversible. Poursuivre ?',
            actions: {
                confirm: {
                    label: 'Oui',
                    color: 'warn',
                },
                cancel: {
                    label: 'Non',
                },
            }
        });
        return lastValueFrom(
            confirmationDialog.afterClosed()
                .pipe(
                    map(result => result === 'confirmed')
                )
        );
    }
}
