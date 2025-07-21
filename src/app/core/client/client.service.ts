import { HttpClient, HttpParams, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { Client } from './client.types';
import { PaginationDto, SortingDto, Pagination, computeQueryParams } from 'app/shared/utils/pagination.types';
import { Observable } from 'rxjs';
import { CreateClientDto, UpdateClientDto } from './client.dto';

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
     * Get shipments as http resource
     *
     * @param paginationParams
     * @param sortingParams
     * @param query
     */
    getAllResource(
        paginationParams?: Signal<PaginationDto>,
        sortingParams?: Signal<SortingDto>,
        query: Signal<string> = signal('')): HttpResourceRef<Pagination<Client>> {
        return httpResource<Pagination<Client>>(() => ({
            url: 'api/clients',
            params: new HttpParams({
                fromObject: {
                    ...computeQueryParams(paginationParams(), sortingParams(), query())
                }
            })
        }));
    }
    getResource(clientId: Signal<number>): HttpResourceRef<Client> {
            return httpResource<Client>(() => ({
                url: 'api/client',
                params: { clientId: clientId() }
            }));
        }

    /**
     * Create a new client
     *
     * @param payload
     */
    create(payload: CreateClientDto): Observable<Client> {
        return this._httpClient.post<Client>('api/client', payload);
    }

    /**
     * Updates a client
     *
     * @param clientId
     * @param changes
     */
    update(clientId: number, changes: UpdateClientDto): Observable<Client> {
        return this._httpClient.patch<Client>('api/client', changes, { params: { clientId } });
    }

    /**
     * Deletes a client from the database
     *
     * @param clientId
     */
    delete(clientId: number): Observable<any> {
        const params = new HttpParams({
            fromObject: { clientId }
        });
        return this._httpClient.delete<any>('api/client', { params });
    }
}
