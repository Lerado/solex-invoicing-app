import { Injectable, inject } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { objectToFlatString } from '@lerado/typescript-toolbox';
import { Shipment, ShipmentClientRole } from 'app/core/shipment/shipment.types';
import { ShipmentApiStore } from './store';
import { concatMap, forkJoin, map, switchMap } from 'rxjs';
import { CreateShipmentDto } from 'app/core/shipment/shipment.dto';
import { ShipmentClientApiStore } from '../shipment-client/store';
import { ShipmentItemApiStore } from '../shipment-item/store';
import { UserApiStore } from '../user/store';
import { CreateShipmentModelDto } from './types';
import { VOLUMETRIC_WEIGHT_FACTOR } from 'app/core/shipment/shipment.constants';

@Injectable({ providedIn: 'root' })
export class ShipmentMockApi {

    private readonly _fuseMockApiService = inject(FuseMockApiService);
    private readonly _shipmentApiStore = inject(ShipmentApiStore);
    private readonly _shipmentClientApiStore = inject(ShipmentClientApiStore);
    private readonly _shipmentItemApiStore = inject(ShipmentItemApiStore);
    private readonly _userApiStore = inject(UserApiStore);
    private readonly VOLUMETRIC_WEIGHT_FACTOR = inject(VOLUMETRIC_WEIGHT_FACTOR);

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
            .onGet('api/shipments/count')
            .reply(({ request }) => this._shipmentApiStore.count().pipe(
                map(count => ([200, count]))
            ));

        this._fuseMockApiService
            .onGet('api/shipments/next-reference')
            .reply(({ }) => this.getNextReference().pipe(
                map(reference => ([200, reference]))
            ));

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
                const { shipment, from, to, items } = cloneDeep(request.body) as Readonly<CreateShipmentDto>;
                // Add missing dto properties and save to db
                return this.getNextReference().pipe(
                    switchMap((number) => {
                        const volumetricWeight = this.VOLUMETRIC_WEIGHT_FACTOR * shipment.bundledHeight * shipment.bundledWidth * shipment.bundledLength;
                        const shipmentDto: Readonly<CreateShipmentModelDto> = {
                            ...shipment,
                            number,
                            volumetricWeight,
                            finalWeight: Math.max(volumetricWeight, shipment.totalWeight)
                        };
                        return this._shipmentApiStore.create(shipmentDto);
                    }),
                    switchMap((shipmentId) => this._shipmentClientApiStore.create({ shipmentId, clientId: from, role: ShipmentClientRole.Sender }).pipe(
                        // Receiver
                        concatMap(() => this._shipmentClientApiStore.create({ shipmentId, clientId: to, role: ShipmentClientRole.Receiver })),
                        // Items
                        concatMap(() => this._shipmentItemApiStore.create(items.map(item => ({ ...item, shipmentId }))))
                    )),
                    map(() => [201, true])
                );
            });

        // -----------------------------------------------------------------------------------------------------
        // @ DELETE
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onDelete('api/shipment')
            .reply(({ request }) => {
                if (!request.params.get('shipmentId')) {
                    return [400, 'Shipment ID is required.'];
                }
                const shipmentId = +request.params.get('shipmentId');
                return this._shipmentApiStore.delete(shipmentId)
                    .pipe(
                        map(() => [204, true])
                    );
            });
    }

    /**
     * Computes the next shipment reference code
     *
     * @returns {string} The next shipment reference
     */
    getNextReference() {
        return forkJoin([this._shipmentApiStore.lastId(), this._userApiStore.get()])
            .pipe(
                map(([lastId, user]) => {
                    return `${user.cityCode}${user.cashierReference}${('000000' + (++lastId)).slice(-6)}`;
                }),
            );
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
