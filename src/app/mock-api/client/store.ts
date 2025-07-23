import { Injectable } from '@angular/core';
import { Store } from '../store';
import { ClientModel, CreateClientModelDto } from './types';
import { map, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClientApiStore extends Store {

    static readonly TABLE_NAME = 'clients';

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get client by id
     *
     * @param clientId
     */
    get(clientId: number): Observable<ClientModel> {
        return this.getBy('id', clientId);
    }

    /**
     * Get shipment by a field
     *
     * @param clientId
     */
    getBy(field: string, fieldValue: unknown): Observable<ClientModel> {
        // Build query
        const query: string = this._persistence
            .queryBuilder
            .select()
            .from(ClientApiStore.TABLE_NAME)
            .where('deletedAt IS NULL')
            .where(`${field} = ${typeof fieldValue === 'string' ? `'${fieldValue}'` : fieldValue}`)
            .limit(1)
            .toString();
        // Execute query
        return this._persistence.executeSelect<ClientModel[]>(query)
            .pipe(
                switchMap((result) => {
                    if (!result.length) {
                        return throwError(() => new Error(`Client with ${field} ${fieldValue} not found`));
                    }
                    return of(result.at(0));
                })
            );
    }

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

    /**
     * Updates client entity in persistence
     *
     * @param clientId
     * @param changes
     */
    update(clientId: number, changes: Omit<Partial<ClientModel>, 'id'>): Observable<boolean> {
        // Update query
        const updateClientRequest = this._persistence
            .queryBuilder
            .update()
            .table(ClientApiStore.TABLE_NAME)
            .where(`id = ${clientId}`)
            .setFields(changes)
            .set('updatedAt', Date.now())
            .toString();

        return this._persistence.executeQuery(updateClientRequest)
            .pipe(
                map(({ rowsAffected }) => rowsAffected === 1)
            );
    }

    /**
     * Soft-deletes a client entity from the database
     *
     * @param clientId
     */
    delete(clientId: number): Observable<boolean> {
        // Deletion query
        const deleteClientRequest = this._persistence
            .queryBuilder
            .update()
            .table(ClientApiStore.TABLE_NAME)
            .where(`id = ${clientId}`)
            .set('deletedAt', Date.now())
            .toString();

        return this._persistence.executeQuery(deleteClientRequest)
            .pipe(
                map(({ rowsAffected }) => rowsAffected === 1)
            );
    }
}
