import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { hashSync }  from 'bcryptjs';
import { UserMockApi } from '../user/api';

@Injectable({ providedIn: 'root' })
export class AuthMockApi {

    /**
     * Constructor
     */
    constructor(
        private readonly _fuseMockApiService: FuseMockApiService,
        private readonly _userMockApi: UserMockApi
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
        // @ Sign in - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/auth/sign-in', 500)
            .reply(() => {
                // Sign in successful
                if (this._userMockApi.user) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { rootPassword, ...user } = cloneDeep(this._userMockApi.user) ?? {};
                    return [
                        200,
                        {
                            user: { ...user, status: 'online' }
                        },
                    ];
                }

                // Invalid credentials
                return [
                    404,
                    false,
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Sign up - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/auth/sign-up', 500)
            .reply(({ request }) => {
                const { cashierReference, cashierName, rootPassword, rootPasswordConfirmation } = cloneDeep(request.body);
                if (rootPassword !== rootPasswordConfirmation) {
                    return [400, false];
                }
                // Write
                const newUser = {
                    id: 1,
                    cashierName,
                    cashierReference,
                    rootPassword: hashSync(rootPassword, 10),
                    createdAt: Date.now()
                };
                this._userMockApi.user = newUser;
                // Simply return true
                return [200, true];
            });
    }
}
