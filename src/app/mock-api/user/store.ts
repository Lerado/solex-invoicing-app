import { Injectable } from '@angular/core';
import { Store } from '../store';
import { Observable, map, of, switchMap, throwError } from 'rxjs';
import { CreateUserModelDto, UserModel } from './types';
import { hashSync } from 'bcryptjs';

@Injectable({ providedIn: 'root' })
export class UserApiStore extends Store {

    readonly TABLE_NAME = 'cashiers';

    private readonly ROOT_MODEL_QUERY = `
    SELECT
        json_group_array(
            json_object(
                'id', c.id,
                'cashierReference', c.cashierReference,
                'cashierName', c.cashierName,
                'countryCode', c.countryCode,
                'cityCode', c.cityCode,
                'createdAt', c.createdAt,
                'updatedAt', c.updatedAt,
                'deletedAt', c.deletedAt,
                'city', (
                    SELECT json_object(
                        'id', ct.id,
                        'name', ct.name,
                        'countryCode', ct.countryCode,
                        'cityCode', ct.cityCode,
                        'createdAt', ct.createdAt,
                        'updatedAt', ct.updatedAt,
                        'deletedAt', ct.deletedAt
                    )
                    FROM cities ct
                    WHERE ct.cityCode = c.cityCode
                    AND ct.countryCode = c.countryCode
                    AND ct.deletedAt IS NULL
                    LIMIT 1
                )
            )
        ) AS data
    FROM cashiers c
    WHERE c.deletedAt IS NULL
    `;

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
        let query = this.ROOT_MODEL_QUERY;
        // If user id is null, take the first only
        if (userId) {
            query += `
                AND c.id = ${userId}
            `;
        }
        // Execute query
        return this._persistence.executeSelect<Array<{ data: string }>>(query.toString())
            .pipe(
                map(result => JSON.parse(result.at(0).data) as UserModel[]),
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
            .where('deletedAt IS NULL')
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
    create(payload: CreateUserModelDto): Observable<number> {
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
                map(({ lastInsertId }) => lastInsertId)
            );
    }
}
