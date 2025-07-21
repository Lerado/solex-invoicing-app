import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, OnInit, signal, viewChild, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { ClientsQueryService } from '../../services/clients-query.service';
import { Client } from 'app/core/client/client.types';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableListAction } from 'app/shared/components/table-list-actions/table-list-actions.types';
import { PaginatedDataSource } from 'app/shared/utils/pagination.types';
import { fromEvent, debounceTime, distinctUntilChanged, tap, merge, map, lastValueFrom } from 'rxjs';
import { ClientsTableListComponent } from '../../components/clients-table-list/clients-table-list.component';
import { TableListActionsComponent } from 'app/shared/components/table-list-actions/table-list-actions.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ClientService } from 'app/core/client/client.service';
import { FuseAlertType, FuseAlertComponent } from '@fuse/components/alert';
import { fuseAnimations } from '@fuse/animations';

export enum ClientListPageAction {
    Edit = 'edit',
    Delete = 'delete'
};

@Component({
    selector: 'sia-clients-list-page',
    imports: [RouterLink, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ClientsTableListComponent, TableListActionsComponent, FuseAlertComponent],
    providers: [ClientsQueryService],
    templateUrl: './clients-list-page.component.html',
    styles: ':host { display: block;}',
    animations: fuseAnimations,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ClientsListPageComponent implements OnInit, AfterViewInit {

    private readonly _clientService = inject(ClientService);
    private readonly _clientsQueryService = inject(ClientsQueryService);
    private readonly _fuseConfirmationService = inject(FuseConfirmationService);
    private readonly _router = inject(Router);
    private readonly _destroyRef = inject(DestroyRef);

    private readonly _paginator = viewChild(MatPaginator);
    private readonly _sort = viewChild(MatSort);
    private readonly _search = viewChild<ElementRef>('searchInput');

    clientsSource = new PaginatedDataSource<Client>(this._clientsQueryService);

    clientsLoading = toSignal(this.clientsSource.loading$);
    clientsCount = toSignal(this.clientsSource.totalCount$);

    clientsColumns: string[] = ['createdAt', 'firstName', 'lastName', 'contact', 'address', 'id', 'actions'];
    clientsActions: TableListAction<ClientListPageAction>[] = [
        // {
        //     key: 'print',
        //     label: 'Imprimer',
        //     icon: 'heroicons_outline:printer',
        //     styles: {
        //         icon: 'text-primary',
        //         button: 'bg-[#4A70FF24]'
        //     }
        // },
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
            key: ClientListPageAction.Edit,
            label: 'Modifier',
            icon: 'heroicons_outline:pencil',
            styles: {
                icon: 'text-success',
                button: 'bg-[#1BB27424]'
            }
        },
        {
            key: ClientListPageAction.Delete,
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
        this.clientsSource.load();
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
                this._loadClientsPage();
            })
        ).subscribe();

        // Reset paginator after sorting
        this._sort().sortChange.pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe(() => this._paginator().pageIndex = 0);

        merge(this._sort().sortChange, this._paginator().page).pipe(
            takeUntilDestroyed(this._destroyRef),
            tap(() => this._loadClientsPage())
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
    async handleAction(actionType: ClientListPageAction, subject: Client): Promise<void> {
        switch (actionType) {
            case ClientListPageAction.Edit:
                this._router.navigate(['/clients', 'edit', subject.id]);
                break;
            case ClientListPageAction.Delete:
                const actionConfirmed = await this._askForConfirmation();
                if (actionConfirmed) {
                    this._deleteClient(subject);
                }
                break;
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Load
     */
    private _loadClientsPage(): void {

        const { pageIndex, pageSize } = this._paginator();
        const { active, direction } = this._sort();

        this.clientsSource.load(
            { page: pageIndex + 1, limit: pageSize },
            { sortKey: active, sort: direction },
            this._search().nativeElement.value
        );
    }

    /**
     * Deletes a client
     * @param {Client} client
     */
    private _deleteClient(client: Client): void {
        this._clientService.delete(client.id).subscribe({
            // Load the same page
            next: () => this._loadClientsPage(),
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
