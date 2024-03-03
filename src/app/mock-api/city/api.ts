import { Injectable } from '@angular/core';
import { cities } from './data';
import { FuseMockApiService } from '@fuse/lib/mock-api';

@Injectable({ providedIn: 'root' })
export class CityMockApi {

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
            .onGet('api/cities')
            .reply(() => [200, this._cities]);
    }
}
