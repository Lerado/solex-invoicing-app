import { Injectable, inject } from '@angular/core';
import { ClientService } from 'app/core/client/client.service';
import { Client } from 'app/core/client/client.types';
import { DataProvider, Pagination, PaginationDto, SortingDto } from 'app/shared/utils/pagination.types';
import { Observable } from 'rxjs';

@Injectable()
export class ClientsQueryService implements DataProvider<Pagination<Client>> {

    private readonly _clientService = inject(ClientService);

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get clients
     *
     * @param paginationParams
     * @param sortingParams
     * @param filter
     */
    get(
        paginationParams?: PaginationDto,
        sortingParams?: SortingDto,
        query: string = '',
    ): Observable<Pagination<Client>> {
        return this._clientService.getAll(paginationParams, sortingParams, query);
    }
}
