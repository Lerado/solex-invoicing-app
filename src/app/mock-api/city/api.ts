import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { CityApiStore } from './store';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CityMockApi {

    /**
     * Constructor
     */
    constructor(
        private readonly _fuseMockApiService: FuseMockApiService,
        private readonly _cityApiStore: CityApiStore
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
            .onGet('api/cities')
            .reply(() => {
                return this._cityApiStore.getAll()
                    .pipe(
                        map(cities => [200, cities])
                    );
            });
    }
}
