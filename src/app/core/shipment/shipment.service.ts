import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Shipment } from './shipment.types';
import { PaginationDto, SortingDto, Pagination, computeQueryParams } from 'app/shared/utils/pagination.types';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShipmentService {

    /**
     * Constructor
     */
    constructor(
        private readonly _httpClient: HttpClient
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get shipments
     *
     * @param paginationParams
     * @param sortingParams
     * @param query
     */
    getAll(
        paginationParams?: PaginationDto,
        sortingParams?: SortingDto,
        query = ''): Observable<Pagination<Shipment>> {
        const params: HttpParams = new HttpParams({
            fromObject: {
                ...computeQueryParams(paginationParams, sortingParams, query)
            }
        });
        return of<Pagination<Shipment>>({
            pageSize: 10,
            currentPage: 1,
            totalItems: 2,
            totalPages: 1,
            items: [
                {
                    id: 1,
                    createdAt: 1708875696,
                    number: '1712ONW',
                    designation: 'COLIS FERMÉ',
                    quantity: 1,
                    weight: 10,
                    price: 3500,
                    totalPrice: 3500,
                    from: {
                        city: { name: 'DLA' }
                    },
                    to: {
                        city: { name: 'BAF' }
                    }
                },
                {
                    id: 2,
                    createdAt: 1708875696,
                    number: '5765LSW',
                    designation: 'KG SUPPLEMENTAIRE',
                    quantity: 140,
                    weight: 1,
                    price: 100,
                    totalPrice: 14000,
                    from: {
                        city: { name: 'DLA' }
                    },
                    to: {
                        city: { name: 'EDEA' }
                    }
                }
            ],
            prev: false,
            next: false
        });
        return this._httpClient.get<Pagination<Shipment>>('api/shipments', { params });
    }
}
