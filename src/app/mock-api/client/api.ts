import { Injectable, inject } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { ClientApiStore } from './store';
import { map } from 'rxjs';
import { ClientModel } from './types';
import { objectToFlatString } from '@lerado/typescript-toolbox';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class ClientMockApi {

    private readonly _fuseMockApiService = inject(FuseMockApiService);
    private readonly _clientApiStore = inject(ClientApiStore);

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
            .onGet('api/clients')
            .reply(({ request }) => {
                return this._clientApiStore.getAll()
                    .pipe(
                        map((clients) => {
                            // Get available queries
                            const search = request.params.get('query');
                            const sort = request.params.get('sortKey') || 'id';
                            const order = request.params.get('sort') || 'desc';
                            const paginate = request.params.get('paginate') === 'false' ? false : true;
                            const page = parseInt(request.params.get('page') ?? '1', 10);
                            const size = parseInt(request.params.get('limit') ?? '10', 10);

                            // Sort the clients
                            if (sort) {
                                clients.sort((a, b) => {
                                    const fieldA = defaultSortingDataAccessor(a, sort).toString().toUpperCase();
                                    const fieldB = defaultSortingDataAccessor(b, sort).toString().toUpperCase();
                                    return order === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
                                });
                            }
                            else {
                                clients.sort((a, b) => order === 'asc' ? a[sort] - b[sort] : b[sort] - a[sort]);
                            }

                            // If search exists...
                            if (search) {
                                // Filter the clients
                                clients = clients.filter(client => defaultFilterPredicate(client, search));
                            }

                            // Paginate - Start
                            const clientsLength = clients.length;

                            // Calculate pagination details
                            const begin = (page - 1) * size;
                            const end = Math.min((size * (page + 1)), clientsLength);
                            const lastPage = Math.max(Math.ceil(clientsLength / size), 1);

                            // Prepare the pagination object
                            let pagination = {};

                            // Return all items at once if no pagination needed
                            if (!paginate) {
                                pagination = {
                                    totalItems: clientsLength,
                                    pageSize: clientsLength,
                                    currentPage: 1,
                                    totalPages: 1,
                                    items: clients,
                                    prev: false,
                                    next: false
                                };
                                return [200, pagination];
                            }

                            // If the requested page number is bigger than
                            // the last possible page number, return null for
                            // clients but also send the last possible page so
                            // the app can navigate to there
                            if (page > lastPage) {
                                clients = null;
                                pagination = {
                                    lastPage,
                                };
                            }
                            else {
                                // Paginate the results by size
                                clients = clients.slice(begin, end);

                                // Prepare the pagination mock-api
                                pagination = {
                                    totalItems: clientsLength,
                                    pageSize: size,
                                    currentPage: page,
                                    totalPages: lastPage,
                                    items: clients,
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
            .onPost('api/client', 500)
            .reply(({ request }) => {
                const newClient = cloneDeep(request.body);
                return this._clientApiStore.create(newClient)
                    .pipe(
                        map(() => [201, true])
                    );
            });
    }
}

export const defaultSortingDataAccessor = (client: ClientModel, sortHeaderId: string): string | number => {
    switch (sortHeaderId) {
        default:
            return client[sortHeaderId];
            break;
    }
};

export const defaultFilterPredicate = (client: ClientModel, filter: string): boolean => {
    // Serialize
    const serialize = objectToFlatString({ ...client, id: null });
    // Then look for the needle
    return serialize.includes(filter.toLowerCase());
};
