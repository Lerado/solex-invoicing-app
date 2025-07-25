import { Injectable, inject } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { objectToFlatString } from '@lerado/typescript-toolbox';
import { ShipmentPackage } from 'app/core/shipment-package/shipment-package.types';
import { ShipmentPackageApiStore } from './store';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShipmentPackageMockApi {

    private readonly _fuseMockApiService = inject(FuseMockApiService);
    private readonly _shipmentPackageApiStore = inject(ShipmentPackageApiStore);

    /**
     * Constructor
     */
    constructor() {
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
                const shipmentId = parseInt(request.params.get('shipmentId') ?? '0', 10);
                return this._shipmentPackageApiStore.getAll({ shipmentId })
                    .pipe(
                        map((shipmentPackages) => {
                            // Get available queries
                            const search = request.params.get('query');
                            const sort = request.params.get('sortKey') || 'id';
                            const paginate = request.params.get('paginate') === 'false' ? false : true;
                            const order = request.params.get('sort') || 'desc';
                            const page = parseInt(request.params.get('page') ?? '1', 10);
                            const size = parseInt(request.params.get('limit') ?? '10', 10);

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

                            // Return all items at once if no pagination needed
                            if (!paginate) {
                                pagination = {
                                    totalItems: shipmentPackagesLength,
                                    pageSize: shipmentPackagesLength,
                                    currentPage: 1,
                                    totalPages: 1,
                                    items: shipmentPackages,
                                    prev: false,
                                    next: false
                                };
                                return [200, pagination];
                            }

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
                        })
                    );
            });

        // -----------------------------------------------------------------------------------------------------
        // @ POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/shipment-package', 500)
            .reply(({ request }) => {
                // Create the package
                const newPackage = cloneDeep(request.body);
                // Return the response
                return this._shipmentPackageApiStore.create(newPackage)
                    .pipe(
                        map(() => [201, true])
                    );
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
