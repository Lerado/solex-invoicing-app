import { Injectable, inject } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { CityApiStore } from './store';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CityMockApi {
    private readonly _fuseMockApiService = inject(FuseMockApiService);
    private readonly _cityApiStore = inject(CityApiStore);

    /** Inserted by Angular inject() migration for backwards compatibility */
    constructor(...args: unknown[]);


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
            .onGet('api/cities')
            .reply(() => {
                return this._cityApiStore.getAll()
                    .pipe(
                        map(cities => [200, cities])
                    );
            });
    }
}
