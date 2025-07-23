import { Injectable } from '@angular/core';
import { Store } from '../store';
import { CreateShipmentItemModelDto } from './dto';
import { map, Observable, of, switchMap, throwError } from 'rxjs';
import { ShipmentItemModel } from './types';

@Injectable({ providedIn: 'root' })
export class ShipmentItemApiStore extends Store {

    static readonly TABLE_NAME = 'shipment_items';

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get shipping items by shipment id
     *
     * @param shipmentId
     */
    getAllByShipment(shipmentId: number): Observable<ShipmentItemModel[]> {
        return this.getAllBy('shipmentId', shipmentId);
    }

    /**
     * Get all shipment client by a field
     *
     * @param shipmentId
     */
    getAllBy(field: string, fieldValue: unknown): Observable<ShipmentItemModel[]> {
        // Build query
        const query: string = this._persistence
            .queryBuilder
            .select()
            .from(ShipmentItemApiStore.TABLE_NAME)
            .where('deletedAt IS NULL')
            .where(`${field} = ${typeof fieldValue === 'string' ? `'${fieldValue}'` : fieldValue}`)
            .toString();
        // Execute query
        return this._persistence.executeSelect<ShipmentItemModel[]>(query)
            .pipe(
                switchMap((result) => {
                    if (!result.length) {
                        return throwError(() => new Error(`Clients with ${field} ${fieldValue} not found`));
                    }
                    return of(result);
                })
            );
    }

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

    /**
     * Updates shipment item entity in persistence
     *
     * @param shipmentItemId
     * @param changes
     */
    update(shipmentItemId: number, changes: Omit<Partial<ShipmentItemModel>, 'id'>): Observable<boolean> {
        // Update query
        const updateClientRequest = this._persistence
            .queryBuilder
            .update()
            .table(ShipmentItemApiStore.TABLE_NAME)
            .where(`id = ${shipmentItemId}`)
            .setFields(changes)
            .set('updatedAt', Date.now())
            .toString();

        return this._persistence.executeQuery(updateClientRequest)
            .pipe(
                map(({ rowsAffected }) => rowsAffected === 1)
            );
    }

    /**
     * Soft-deletes a shipment item entity from the database
     *
     * @param shipmentItemId
     */
    delete(shipmentItemId: number): Observable<boolean> {
        // Deletion query
        const deleteClientRequest = this._persistence
            .queryBuilder
            .update()
            .table(ShipmentItemApiStore.TABLE_NAME)
            .where(`id = ${shipmentItemId}`)
            .set('deletedAt', Date.now())
            .toString();

        return this._persistence.executeQuery(deleteClientRequest)
            .pipe(
                map(({ rowsAffected }) => rowsAffected === 1)
            );
    }
}
