import { Injectable } from '@angular/core';
import { Shipment } from 'app/core/shipment/shipment.types';
import { ShipmentService } from 'app/core/shipment/shipment.service';
import { DataProvider, PaginationDto, SortingDto, Pagination } from 'app/shared/utils/pagination.types';
import { Observable } from 'rxjs';


@Injectable()
export class ShipmentsQueryService implements DataProvider<Pagination<Shipment>> {

    /**
     * Constructor
     */
    constructor(
        private readonly _shipmentService: ShipmentService
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get shipments
     *
     * @param paginationParams
     * @param sortingParams
     * @param filter
     */
    get(
        paginationParams?: PaginationDto,
        sortingParams?: SortingDto,
        query: string = '',
    ): Observable<Pagination<Shipment>> {
        return this._shipmentService.getAll(paginationParams, sortingParams, query);
    }
}
