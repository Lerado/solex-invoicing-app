import { Observable } from 'rxjs';
import { Store } from '../store';
import { CityModel } from './types';
import { Injectable } from '@angular/core';
import { HasMigrations, Migrations } from 'app/core/persistence/persistence.types';
import { cities } from './data';

@Injectable({ providedIn: 'root' })
export class CityApiStore extends Store implements HasMigrations {

    readonly TABLE_NAME = 'cities';

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    get migrations(): Migrations {
        return [
            {
                priority: 0,
                query: this._persistence
                    .queryBuilder
                    .insert()
                    .into(this.TABLE_NAME)
                    .setFieldsRows(
                        cities.map(city => ({ ...city, createdAt: Date.now() }))
                    )
                    .toString(),
                ignoreIf: this._persistence
                    .queryBuilder
                    .select()
                    .from(this.TABLE_NAME)
                    .field('id')
                    .toString()
            }
        ];
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all cities
     */
    getAll(): Observable<CityModel[]> {
        // Build query
        const query: string = this._persistence
            .queryBuilder
            .select()
            .from(this.TABLE_NAME)
            .where('deletedAt IS NULL')
            .toString();
        // Execute query
        return this._persistence.executeSelect<CityModel[]>(query);
    }
}
