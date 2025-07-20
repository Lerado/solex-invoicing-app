import { Injectable } from '@angular/core';
import { Store } from '../store';
import { CreateShipmentClientModelDto } from './types';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShipmentClientApiStore extends Store {

    static readonly TABLE_NAME = 'shipment_clients';

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create a shipment client
     *
     * @param payload
     */
    create(payload: CreateShipmentClientModelDto): Observable<number> {
        // Build query
        const createShipmentClientQuery: string = this._persistence
            .queryBuilder
            .insert({ replaceSingleQuotes: true })
            .into(ShipmentClientApiStore.TABLE_NAME)
            .setFields({
                ...payload,
                createdAt: Date.now()
            })
            .toString();
        return this._persistence.executeQuery(createShipmentClientQuery)
            .pipe(
                map(({ lastInsertId }) => lastInsertId)
            );
    }
}
