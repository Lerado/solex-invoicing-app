import { HttpClient, HttpParams, httpResource, HttpResourceRef } from '@angular/common/http';
import { Injectable, Signal, inject, signal } from '@angular/core';
import { Shipment } from './shipment.types';
import { PaginationDto, SortingDto, Pagination, computeQueryParams } from 'app/shared/utils/pagination.types';
import { Observable, switchMap } from 'rxjs';
import { CreateShipmentDto, UpdateShipmentDto } from './shipment.dto';

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
     * Get shipments as http resource
     *
     * @param paginationParams
     * @param sortingParams
     * @param query
     */
    getAllResource(
        paginationParams?: Signal<PaginationDto>,
        sortingParams?: Signal<SortingDto>,
        query: Signal<string> = signal('')): HttpResourceRef<Pagination<Shipment>> {
        return httpResource<Pagination<Shipment>>(() => ({
            url: 'api/shipments',
            params: new HttpParams({
                fromObject: {
                    ...computeQueryParams(paginationParams(), sortingParams(), query())
                }
            })
        }));
    }

    /**
     * Get shipment by id
     *
     * @param shipmentId
     */
    get(shipmentId: number): Observable<Shipment> {
        return this._httpClient.get<Shipment>('api/shipment', { params: { shipmentId } });
    }
    getResource(shipmentId: Signal<number>): HttpResourceRef<Shipment> {
        return httpResource<Shipment>(() => ({
            url: 'api/shipment',
            params: { shipmentId: shipmentId() }
        }));
    }

    /**
     * Get shipment by shipment number
     *
     * @param shipmentNumber
     */
    getByNumber(shipmentNumber: string): Observable<Shipment> {
        return this._httpClient.get<Shipment>('api/shipment/by', { params: { field: 'number', value: shipmentNumber } });
    }
    getByNumberResource(shipmentNumber: Signal<string>): HttpResourceRef<Shipment> {
        return httpResource<Shipment>(() => ({
            url: 'api/shipment/by',
            params: { field: 'number', value: shipmentNumber() }
        }));
    }

    /**
     * Get next reference number
     */
    getNextReference(): Observable<string> {
        return this._httpClient.get<string>('api/shipments/next-reference');
    }

    /**
     * Create a new shipment
     *
     * @param payload
     */
    create(payload: CreateShipmentDto): Observable<Shipment> {
        return this.getNextReference().pipe(
            switchMap((number) => this._httpClient.post<Shipment>('api/shipment', { ...payload, number }))
        );
    }

    /**
     * Updates a shipment
     *
     * @param payload
     */
    update(payload: UpdateShipmentDto): Observable<Shipment> {
        return this._httpClient.patch<Shipment>('api/shipment', payload);
    }

    /**
     * Deletes a shipment from the database
     *
     * @param shipmentId
     */
    delete(shipmentId: number): Observable<any> {
        const params = new HttpParams({
            fromObject: { shipmentId }
        });
        return this._httpClient.delete<any>('api/shipment', { params });
    }
}
