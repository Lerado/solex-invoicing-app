import { Injectable } from '@angular/core';
import { Store } from '../store';
import { Observable, map, of, switchMap, throwError } from 'rxjs';
import { CreateUserModelDto, UserModel } from './types';
import { hashSync } from 'bcryptjs';

@Injectable({ providedIn: 'root' })
export class UserApiStore extends Store {

    readonly TABLE_NAME = 'users';

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get user by id
     *
     * @param userId
     */
    get(userId: number = null): Observable<UserModel> {
        // Build query
        let query = this._persistence
            .queryBuilder
            .select()
            .from(this.TABLE_NAME);
        // If user id is null, take the first only
        if (userId) {
            query = query.where('id = ?', userId);
        }
        else {
            query = query.limit(1);
        }

        // Execute query
        return this._persistence.executeSelect<UserModel[]>(query.toString())
            .pipe(
                switchMap((result) => {
                    if (!result.length) {
                        return throwError(() => new Error(`User with id ${userId} not found`));
                    }
                    return of(result.at(0));
                })
            );
    }

    /**
     * Count user objects
     */
    count(): Observable<number> {
        // Build query
        const query: string = this._persistence
            .queryBuilder
            .select()
            .field('COUNT(*)')
            .from(this.TABLE_NAME)
            .toString();
        // Execute query
        return this._persistence.executeSelect<number[]>(query)
            .pipe(
                map(result => result.at(0))
            );
    }

    /**
     * Create a user
     *
     * @param payload
     */
    create(payload: CreateUserModelDto): Observable<boolean> {
        // Build query
        const query: string = this._persistence
            .queryBuilder
            .insert()
            .into(this.TABLE_NAME)
            .setFields({
                ...payload,
                rootPassword: hashSync(payload.rootPassword, 10),
                createdAt: Date.now()
            })
            .toString();
        // Execute query
        return this._persistence.executeQuery(query)
            .pipe(
                map(result => result.rowsAffected === 1)
            );
    }
}
