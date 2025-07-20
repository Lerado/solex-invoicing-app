import { Injectable, inject } from '@angular/core';
import { ShipmentPackageService } from 'app/core/shipment-package/shipment-package.service';
import { ShipmentPackage } from 'app/core/shipment-package/shipment-package.types';
import { DataProvider, PaginationDto, SortingDto, Pagination } from 'app/shared/utils/pagination.types';
import { Observable } from 'rxjs';

/**
 * @deprecated
 */
@Injectable()
export class ShipmentPackagesQueryService implements DataProvider<Pagination<ShipmentPackage>> {

    private readonly _shipmentPackageService = inject(ShipmentPackageService);

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
