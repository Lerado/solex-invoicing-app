import { Injectable, inject } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { UserApiStore } from './store';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserMockApi {

    private readonly _fuseMockApiService = inject(FuseMockApiService);
    private readonly _userApiStore = inject(UserApiStore);

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
        // @ User - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/user')
            .reply(() => {
                return this._userApiStore.get()
                    .pipe(
                        map((result) => {
                            // Sign in successful
                            if (result) {
                                const { rootPassword, ...user } = cloneDeep(result) ?? {};
                                return [
                                    200,
                                    {
                                        ...user,
                                        status: 'online'
                                    },
                                ];
                            }

                            // Invalid credentials
                            return [
                                404,
                                false
                            ];
                        })
                    );
            });
    }
}
