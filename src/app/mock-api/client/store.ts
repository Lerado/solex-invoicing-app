import { Injectable } from '@angular/core';
import { Store } from '../store';
import { ClientModel, CreateClientModelDto } from './types';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClientApiStore extends Store {

    static readonly TABLE_NAME = 'clients';

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all clients
     */
    getAll(): Observable<ClientModel[]> {
        // Build query
        const query: string = this._persistence
            .queryBuilder
            .select()
            .from(ClientApiStore.TABLE_NAME)
            .where('deletedAt IS NULL')
            .toString();
        // Execute query
        return this._persistence.executeSelect<ClientModel[]>(query);
    }

    /**
     * Create a client
     *
     * @param payload
     */
    create(payload: CreateClientModelDto): Observable<number> {
        // Build query
        const createClientQuery: string = this._persistence
            .queryBuilder
            .insert({ replaceSingleQuotes: true })
            .into(ClientApiStore.TABLE_NAME)
            .setFields({
                ...payload,
                createdAt: Date.now()
            })
            .toString();
        return this._persistence.executeQuery(createClientQuery)
        .pipe(
            map(({ lastInsertId }) => lastInsertId)
        );
    }
}
