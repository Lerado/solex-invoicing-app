import { Injectable } from '@angular/core';
import { Store } from '../store';
import { CreateShipmentItemModelDto } from './types';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShipmentItemApiStore extends Store {

    static readonly TABLE_NAME = 'shipment_items';

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create a shipment item
     *
     * @param payload
     */
    create(payload: CreateShipmentItemModelDto | CreateShipmentItemModelDto[]): Observable<number> {
        // Build query
        let createShipmentItemInsert = this._persistence
            .queryBuilder
            .insert({ replaceSingleQuotes: true })
            .into(ShipmentItemApiStore.TABLE_NAME);

        if (Array.isArray(payload)) {
            createShipmentItemInsert = createShipmentItemInsert.setFieldsRows(
                payload.map(item => ({ ...item, createdAt: Date.now() }))
            );
        }
        else {
            createShipmentItemInsert = createShipmentItemInsert.setFields({
                ...payload,
                createdAt: Date.now()
            });
        }

        const createShipmentItemQuery = createShipmentItemInsert.toString();

        return this._persistence.executeQuery(createShipmentItemQuery)
            .pipe(
                map(({ lastInsertId }) => lastInsertId)
            );
    }
}
