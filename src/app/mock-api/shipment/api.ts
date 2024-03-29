import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { objectToFlatString } from '@lerado/typescript-toolbox';
import { Shipment } from 'app/core/shipment/shipment.types';
import { ShipmentApiStore } from './store';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShipmentMockApi {

    /**
     * Constructor
     */
    constructor(
        private readonly _fuseMockApiService: FuseMockApiService,
        private readonly _shipmentApiStore: ShipmentApiStore
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
            .onGet('api/shipment')
            .reply(({ request }) => {
                const shipmentId = +request.params.get('shipmentId');
                return this._shipmentApiStore.get(shipmentId)
                    .pipe(
                        map(shipment => [200, shipment])
                    );
            });
        this._fuseMockApiService
            .onGet('api/shipment/by')
            .reply(({ request }) => {
                const field = request.params.get('field');
                const value = request.params.get('value');
                return this._shipmentApiStore.getBy(field, value)
                    .pipe(
                        map(shipment => [200, shipment])
                    );
            });

        this._fuseMockApiService
            .onGet('api/shipments')
            .reply(({ request }) => {
                return this._shipmentApiStore.getAll()
                    .pipe(
                        map((shipments) => {
                            // Get available queries
                            const search = request.params.get('query');
                            const sort = request.params.get('sortKey') || 'id';
                            const order = request.params.get('sort') || 'desc';
                            const paginate = request.params.get('paginate') === 'false' ? false : true;
                            const page = parseInt(request.params.get('page') ?? '1', 10);
                            const size = parseInt(request.params.get('limit') ?? '10', 10);

                            // Sort the shipments
                            if (sort) {
                                shipments.sort((a, b) => {
                                    const fieldA = defaultSortingDataAccessor(a, sort).toString().toUpperCase();
                                    const fieldB = defaultSortingDataAccessor(b, sort).toString().toUpperCase();
                                    return order === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
                                });
                            }
                            else {
                                shipments.sort((a, b) => order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]);
                            }

                            // If search exists...
                            if (search) {
                                // Filter the shipments
                                shipments = shipments.filter(shipment => defaultFilterPredicate(shipment, search));
                            }

                            // Paginate - Start
                            const shipmentsLength = shipments.length;

                            // Calculate pagination details
                            const begin = (page - 1) * size;
                            const end = Math.min((size * (page + 1)), shipmentsLength);
                            const lastPage = Math.max(Math.ceil(shipmentsLength / size), 1);

                            // Prepare the pagination object
                            let pagination = {};

                            // Return all items at once if no pagination needed
                            if (!paginate) {
                                pagination = {
                                    totalItems: shipmentsLength,
                                    pageSize: shipmentsLength,
                                    currentPage: 1,
                                    totalPages: 1,
                                    items: shipments,
                                    prev: false,
                                    next: false
                                };
                                return [200, pagination];
                            }

                            // If the requested page number is bigger than
                            // the last possible page number, return null for
                            // shipments but also send the last possible page so
                            // the app can navigate to there
                            if (page > lastPage) {
                                shipments = null;
                                pagination = {
                                    lastPage,
                                };
                            }
                            else {
                                // Paginate the results by size
                                shipments = shipments.slice(begin, end);

                                // Prepare the pagination mock-api
                                pagination = {
                                    totalItems: shipmentsLength,
                                    pageSize: size,
                                    currentPage: page,
                                    totalPages: lastPage,
                                    items: shipments,
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
            .onPost('api/shipment', 500)
            .reply(({ request }) => {
                const newShipment = cloneDeep(request.body);
                return this._shipmentApiStore.create(newShipment)
                    .pipe(
                        map(() => [201, true])
                    );
            });
    }
}

export const defaultSortingDataAccessor = (shipment: Shipment, sortHeaderId: string): string | number => {
    switch (sortHeaderId) {
        default:
            return shipment[sortHeaderId];
            break;
    }
};

export const defaultFilterPredicate = (shipment: Shipment, filter: string): boolean => {
    // Serialize
    const serialize = objectToFlatString({ ...shipment, id: null });
    // Then look for the needle
    return serialize.includes(filter.toLowerCase());
};
