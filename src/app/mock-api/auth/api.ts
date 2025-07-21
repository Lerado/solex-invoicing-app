import { Injectable, inject } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import { UserApiStore } from '../user/store';
import { catchError, map, of, switchMap } from 'rxjs';
import { SignUpDto } from 'app/core/auth/auth.dto';

@Injectable({ providedIn: 'root' })
export class AuthMockApi {

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
        // @ Sign in - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/auth/sign-in', 500)
            .reply(() => {
                return this._userApiStore.get()
                    .pipe(
                        map((result) => {
                            // Sign in successful
                            const { rootPassword, ...user } = cloneDeep(result) ?? {};
                            return [
                                200,
                                {
                                    user: { ...user, status: 'online' }
                                },
                            ];
                        }),
                        catchError(() => [
                            404,
                            false,
                        ])
                    );
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Sign up - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/auth/sign-up', 500)
            .reply(({ request }) => {
                const { cashierReference, cashierName, countryCode, cityCode, rootPassword, rootPasswordConfirmation } = cloneDeep(request.body) as SignUpDto;
                if (rootPassword !== rootPasswordConfirmation) {
                    return [400, false];
                }
                return this._userApiStore.count()
                    .pipe(
                        map(result => result > 0),
                        switchMap((accountAlreadyExists) => {
                            if (accountAlreadyExists) {
                                return of([400, false]);
                            }
                            // Write
                            const newUser = {
                                cashierName,
                                cashierReference,
                                countryCode,
                                cityCode,
                                rootPassword
                            };
                            return this._userApiStore.create(newUser)
                                .pipe(
                                    map(created => [created ? 201 : 500, created])
                                );
                        })
                    );

            });
    }
}
