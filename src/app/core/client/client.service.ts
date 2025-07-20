import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Client } from './client.types';
import { PaginationDto, SortingDto, Pagination, computeQueryParams } from 'app/shared/utils/pagination.types';
import { Observable } from 'rxjs';
import { CreateClientDto } from './client.dto';

@Injectable({ providedIn: 'root' })
export class ClientService {

    private readonly _httpClient = inject(HttpClient);


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get clients
     *
     * @param paginationParams
     * @param sortingParams
     * @param query
     */
    getAll(
        paginationParams?: PaginationDto,
        sortingParams?: SortingDto,
        query = ''): Observable<Pagination<Client>> {
        const params: HttpParams = new HttpParams({
            fromObject: {
                ...computeQueryParams(paginationParams, sortingParams, query)
            }
        });
        return this._httpClient.get<Pagination<Client>>('api/clients', { params });
    }

    /**
     * Create a new client
     *
     * @param payload
     */
    create(payload: CreateClientDto): Observable<Client> {
        return this._httpClient.post<Client>('api/client', payload);
    }
}
