import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class UserMockApi {
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set user(value: any) {
        // Store the value
        localStorage.setItem('Auth.User', JSON.stringify(value));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get user(): any {
        return JSON.parse(localStorage.getItem('Auth.User'));
    }

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
        // @ User - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/user')
            .reply(() => [200, cloneDeep(this.user)]);
    }
}
