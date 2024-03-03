import { Injectable } from '@angular/core';
import { shipmentPackages } from './data';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { assign, cloneDeep } from 'lodash-es';
import { objectToFlatString } from '@lerado/typescript-toolbox';
import { ShipmentPackage } from 'app/core/shipment-package/shipment-package.types';
import { ShipmentMockApi } from '../shipment/api';

@Injectable({ providedIn: 'root' })
export class ShipmentPackageMockApi {

    shipmentPackages = shipmentPackages;

    /**
     * Constructor
     */
    constructor(
        private readonly _fuseMockApiService: FuseMockApiService,
        private readonly _shipmentMockApi: ShipmentMockApi
    ) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/shipment-packages')
            .reply(({ request }) => {
                // Get available queries
                const search = request.params.get('query');
                const sort = request.params.get('sortKey') || 'id';
                const order = request.params.get('sort') || 'desc';
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('limit') ?? '10', 10);

                // Clone the shipmentPackages
                let shipmentPackages = cloneDeep(this.shipmentPackages);

                // Sort the shipmentPackages
                if (sort) {
                    shipmentPackages.sort((a, b) => {
                        const fieldA = defaultSortingDataAccessor(a, sort).toString().toUpperCase();
                        const fieldB = defaultSortingDataAccessor(b, sort).toString().toUpperCase();
                        return order === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
                    });
                }
                else {
                    shipmentPackages.sort((a, b) => order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]);
                }

                // If search exists...
                if (search) {
                    // Filter the shipmentPackages
                    shipmentPackages = shipmentPackages.filter(shipmentPackage => defaultFilterPredicate(shipmentPackage, search));
                }

                // Paginate - Start
                const shipmentPackagesLength = shipmentPackages.length;

                // Calculate pagination details
                const begin = (page - 1) * size;
                const end = Math.min((size * (page + 1)), shipmentPackagesLength);
                const lastPage = Math.max(Math.ceil(shipmentPackagesLength / size), 1);

                // Prepare the pagination object
                let pagination = {};

                // If the requested page number is bigger than
                // the last possible page number, return null for
                // shipmentPackages but also send the last possible page so
                // the app can navigate to there
                if (page > lastPage) {
                    shipmentPackages = null;
                    pagination = {
                        lastPage,
                    };
                }
                else {
                    // Paginate the results by size
                    shipmentPackages = shipmentPackages.slice(begin, end);

                    // Prepare the pagination mock-api
                    pagination = {
                        totalItems: shipmentPackagesLength,
                        pageSize: size,
                        currentPage: page,
                        totalPages: lastPage,
                        items: shipmentPackages,
                        prev: page > 1,
                        next: page < lastPage,
                    };
                }

                // Return the response
                return [
                    200,
                    pagination,
                ];
            });
    }
}

export const defaultSortingDataAccessor = (shipmentPackage: ShipmentPackage, sortHeaderId: string): string | number => {
    switch (sortHeaderId) {
        default:
            return shipmentPackage[sortHeaderId];
            break;
    }
};

export const defaultFilterPredicate = (shipmentPackage: ShipmentPackage, filter: string): boolean => {
    // Serialize
    const serialize = objectToFlatString({ ...shipmentPackage, id: null });
    // Then look for the needle
    return serialize.includes(filter.toLowerCase());
};
