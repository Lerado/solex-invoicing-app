import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginationDto, SortingDto, Pagination, computeQueryParams } from 'app/shared/utils/pagination.types';
import { Observable } from 'rxjs';
import { ShipmentPackage } from './shipment-package.types';
import { CreateShipmentPackageDto } from './shipment-package.dto';

/**
 * @deprecated
 */
@Injectable({ providedIn: 'root' })
export class ShipmentPackageService {

    private readonly _httpClient = inject(HttpClient);

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
        query = '',
        filters: { shipmentId?: number } = {}): Observable<Pagination<ShipmentPackage>> {
        const params: HttpParams = new HttpParams({
            fromObject: {
                ...computeQueryParams(paginationParams, sortingParams, query),
                ...filters
            }
        });

        return this._httpClient.get<Pagination<ShipmentPackage>>('api/shipment-packages', { params });
    }

    /**
     * Create a new shipment package
     *
     * @param payload
     */
    create(payload: CreateShipmentPackageDto): Observable<ShipmentPackage> {
        return this._httpClient.post<ShipmentPackage>('api/shipment-package', payload);
    }
}
