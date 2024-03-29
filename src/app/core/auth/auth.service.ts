import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { SignUpDto } from './auth.dto';
import { SignInResponse } from './auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private readonly _httpClient: HttpClient,
        private readonly _userService: UserService
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(): Observable<SignInResponse> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post<SignInResponse>('api/auth/sign-in', {}).pipe(
            switchMap((response: SignInResponse) => {
                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            }),
        );
    }

    /**
     * Sign up
     *
     * @param payload
     */
    signUp(payload: SignUpDto): Observable<unknown> {
        return this._httpClient.post('api/auth/sign-up', payload);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return this.signIn().pipe(
            map(() => true),
            catchError(() => of(false))
        );
    }
}
