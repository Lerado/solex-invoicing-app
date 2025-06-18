import { Injectable, inject } from '@angular/core';
import { ShipmentPackageService } from 'app/core/shipment-package/shipment-package.service';
import { ShipmentPackage } from 'app/core/shipment-package/shipment-package.types';
import { DataProvider, PaginationDto, SortingDto, Pagination } from 'app/shared/utils/pagination.types';
import { Observable } from 'rxjs';


@Injectable()
export class ShipmentPackagesQueryService implements DataProvider<Pagination<ShipmentPackage>> {
    private readonly _shipmentPackageService = inject(ShipmentPackageService);

    /** Inserted by Angular inject() migration for backwards compatibility */
    constructor(...args: unknown[]);


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
     * @param filter
     */
    get(
        paginationParams?: PaginationDto,
        sortingParams?: SortingDto,
        query: string = '',
    ): Observable<Pagination<ShipmentPackage>> {
        return this._shipmentPackageService.getAll(paginationParams, sortingParams, query);
    }
}
