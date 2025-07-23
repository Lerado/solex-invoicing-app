import { Injectable } from '@angular/core';
import { Store } from '../store';
import { CreateShipmentClientModelDto, UpdateShipmentClientModelDto } from './dto';
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

    /**
     * Updates a shipping client entity in persistence
     *
     * @param shipmentClientId
     * @param changes
     */
    update(shipmentClientId: number | Required<Pick<UpdateShipmentClientModelDto, 'shipmentId' | 'role'>>, changes: Omit<Partial<UpdateShipmentClientModelDto>, 'id'>): Observable<boolean> {
        // Update query
        let updateClientRequest = this._persistence
            .queryBuilder
            .update()
            .table(ShipmentClientApiStore.TABLE_NAME);

        if (typeof shipmentClientId === 'number') {
            updateClientRequest = updateClientRequest.where(`id = ${shipmentClientId}`);
        }
        else {
            updateClientRequest = updateClientRequest.where(`shipmentId = ${shipmentClientId.shipmentId} AND role = ${shipmentClientId.role}`);
        }

        updateClientRequest = updateClientRequest.setFields(changes)
            .set('updatedAt', Date.now());

        return this._persistence.executeQuery(updateClientRequest.toString())
            .pipe(
                map(({ rowsAffected }) => rowsAffected === 1)
            );
    }
}
