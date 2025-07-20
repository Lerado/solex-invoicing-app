import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Shipment } from './shipment.types';
import { PaginationDto, SortingDto, Pagination, computeQueryParams } from 'app/shared/utils/pagination.types';
import { Observable } from 'rxjs';
import { CreateShipmentDto } from './shipment.dto';

@Injectable({ providedIn: 'root' })
export class ShipmentService {

    private readonly _httpClient = inject(HttpClient);

    /**
     * Constructor
     */
    constructor() { }

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
        return this._httpClient.get<Pagination<Shipment>>('api/shipments', { params });
    }

    /**
     * Get shipment by id
     *
     * @param shipmentId
     */
    get(shipmentId: number): Observable<Shipment> {
        return this._httpClient.get<Shipment>('api/shipment', { params: { shipmentId } });
    }

    /**
     * Get shipment by shipment number
     *
     * @param shipmentNumber
     */
    getByNumber(shipmentNumber: string): Observable<Shipment> {
        return this._httpClient.get<Shipment>('api/shipment/by', { params: { field: 'number', value: shipmentNumber } });
    }

    /**
     * Create a new shipment
     *
     * @param payload
     */
    create(payload: CreateShipmentDto): Observable<Shipment> {
        return this._httpClient.post<Shipment>('api/shipment', payload);
    }
}
