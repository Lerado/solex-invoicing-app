import { Injectable } from '@angular/core';
import { shipments } from './data';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { assign, cloneDeep } from 'lodash-es';
import { objectToFlatString } from '@lerado/typescript-toolbox';
import { Shipment } from 'app/core/shipment/shipment.types';
import { cities } from '../city/data';

@Injectable({ providedIn: 'root' })
export class ShipmentMockApi {

    shipments = shipments;
    private _cities = cities;

    /**
     * Constructor
     */
    constructor(
        private readonly _fuseMockApiService: FuseMockApiService
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
                const shipment = this.shipments.find(shipment => shipment.id === +request.params.get('shipmentId'));
                return [200, shipment];
            });

        this._fuseMockApiService
            .onGet('api/shipments')
            .reply(({ request }) => {
                // Get available queries
                const search = request.params.get('query');
                const sort = request.params.get('sortKey') || 'id';
                const order = request.params.get('sort') || 'desc';
                const paginate = request.params.get('paginate') === 'false' ? false : true;
                const page = parseInt(request.params.get('page') ?? '1', 10);
                const size = parseInt(request.params.get('limit') ?? '10', 10);

                // Clone the shipments
                let shipments = cloneDeep(this.shipments);

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
            });

        // -----------------------------------------------------------------------------------------------------
        // @ POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/shipment')
            .reply(({ request }) => {
                const newShipment = Object.assign(cloneDeep(request.body), {
                    id: this.shipments.length + 1,
                    totalPrice: 0,
                    createdAt: Date.now()
                });
                newShipment.from.city = this._cities.find(city => city.id === newShipment.from.cityId);
                newShipment.to.city = this._cities.find(city => city.id === newShipment.to.cityId);
                this.shipments.unshift(newShipment);
                return [200, newShipment];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ PATCH
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPatch('api/shipment')
            .reply(({ request }) => {
                // Get the id and item
                const id = +request.body.id;
                const shipment = cloneDeep(request.body.shipment);

                // Prepare the updated shipment
                let updatedShipment = null;

                // Find the shipment and update it
                this.shipments.forEach((item, index, shipments) => {
                    if (item.id === id) {
                        // Update the shipment
                        shipments[index] = assign({}, shipments[index], shipment);

                        // Store the updated shipment
                        updatedShipment = shipments[index];
                    }
                });

                // Return the response
                return [200, updatedShipment];
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
