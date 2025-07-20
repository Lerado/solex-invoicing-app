import { Observable, map, switchMap } from 'rxjs';
import { Store } from '../store';
import { CreateShipmentPackageModelDto, ShipmentPackageModel } from './types';
import { Injectable } from '@angular/core';
import { ShipmentApiStore } from '../shipment/store';

@Injectable({ providedIn: 'root' })
export class ShipmentPackageApiStore extends Store {

    static readonly TABLE_NAME = 'shipment_items';

    private readonly ROOT_MODEL_QUERY = `
    SELECT
        json_group_array(
            json_object(
                'id', ${ShipmentPackageApiStore.TABLE_NAME}.id,
                'totalPrice', ${ShipmentPackageApiStore.TABLE_NAME}.totalPrice,
                'price', ${ShipmentPackageApiStore.TABLE_NAME}.price,
                'quantity', ${ShipmentPackageApiStore.TABLE_NAME}.quantity,
                'weight', ${ShipmentPackageApiStore.TABLE_NAME}.weight,
                'designation', ${ShipmentPackageApiStore.TABLE_NAME}.designation,
                'shipmentId', ${ShipmentPackageApiStore.TABLE_NAME}.shipmentId,
                'createdAt', ${ShipmentPackageApiStore.TABLE_NAME}.createdAt,
                'updatedAt', ${ShipmentPackageApiStore.TABLE_NAME}.updatedAt,
                'shipment', json_object(
                    'id', ${ShipmentApiStore.TABLE_NAME}.id,
                    'totalPrice', ${ShipmentApiStore.TABLE_NAME}.totalPrice,
                    'number', ${ShipmentApiStore.TABLE_NAME}.number,
                    'pickupTime', ${ShipmentApiStore.TABLE_NAME}.pickupTime,
                    'pickupDate', ${ShipmentApiStore.TABLE_NAME}.pickupDate,
                    'createdAt', ${ShipmentApiStore.TABLE_NAME}.createdAt,
                    'updatedAt', ${ShipmentApiStore.TABLE_NAME}.updatedAt,
                    'from', json_object(
                        'id', shipments_from.id,
                        'firstName', shipments_from.firstName,
                        'lastName', shipments_from.lastName,
                        'country', shipments_from.country,
                        'contact', shipments_from.contact,
                        'address', shipments_from.address,
                        'city', json_object(
                            'id', shipper_city.id,
                            'name', shipper_city.name,
                            'country', shipper_city.country,
                            'createdAt', shipper_city.createdAt,
                            'updatedAt', shipper_city.updatedAt
                        ),
                        'createdAt', shipments_from.createdAt,
                        'updatedAt', shipments_from.updatedAt
                    ),
                    'to', json_object(
                        'id', shipments_to.id,
                        'firstName', shipments_to.firstName,
                        'lastName', shipments_to.lastName,
                        'country', shipments_to.country,
                        'contact', shipments_to.contact,
                        'address', shipments_to.address,
                        'city', json_object(
                            'id', recipient_city.id,
                            'name', recipient_city.name,
                            'country', recipient_city.country,
                            'createdAt', recipient_city.createdAt,
                            'updatedAt', recipient_city.updatedAt
                        ),
                        'createdAt', shipments_to.createdAt,
                        'updatedAt', shipments_to.updatedAt
                    )
                )
            )
        ) AS data
    FROM
        ${ShipmentPackageApiStore.TABLE_NAME}
    JOIN
        ${ShipmentApiStore.TABLE_NAME} ON ${ShipmentApiStore.TABLE_NAME}.id = ${ShipmentPackageApiStore.TABLE_NAME}.shipmentId
    JOIN
        shipments_from ON ${ShipmentApiStore.TABLE_NAME}.id = shipments_from.shipmentId
    JOIN
        cities AS shipper_city ON shipments_from.cityId = shipper_city.id
    JOIN
        shipments_to ON ${ShipmentApiStore.TABLE_NAME}.id = shipments_to.shipmentId
    JOIN
        cities AS recipient_city ON shipments_to.cityId = recipient_city.id
    `;

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all shipment packages
     */
    getAll(filters: Partial<{ shipmentId: number }> = {}): Observable<ShipmentPackageModel[]> {
        const { shipmentId } = filters;
        let query = this.ROOT_MODEL_QUERY;
        if (shipmentId) {
            query += `
                WHERE ${ShipmentPackageApiStore.TABLE_NAME}.shipmentId = ${shipmentId}
                `;
        }
        // Execute query
        return this._persistence.executeSelect<Array<{ data: string }>>(query)
            .pipe(
                map(result => JSON.parse(result.at(0).data) as ShipmentPackageModel[])
            );
    }

    /**
     * Create a shipment package
     *
     * @param payload
     */
    create(payload: CreateShipmentPackageModelDto): Observable<boolean> {
        // Build query
        const createShipmentPackageQuery: string = this._persistence
            .queryBuilder
            .insert({ replaceSingleQuotes: true })
            .into(ShipmentPackageApiStore.TABLE_NAME)
            .setFields({
                ...payload,
                createdAt: Date.now(),
                totalPrice: payload.price * payload.quantity
            })
            .toString();
        // Create shipment package first
        return this._persistence.executeQuery(createShipmentPackageQuery)
            .pipe(
                switchMap(() => {
                    // Update the shipment total price
                    const updateShipmentPriceQuery: string = this._persistence
                        .queryBuilder
                        .update()
                        .table(ShipmentApiStore.TABLE_NAME)
                        .where('id = ?', payload.shipmentId)
                        .setFields({
                            updatedAt: Date.now(),
                            [`totalPrice = totalPrice + ${payload.price * payload.quantity}`]: undefined
                        })
                        .toString();
                    return this._persistence.executeQuery(updateShipmentPriceQuery);
                }),
                map(result => result.rowsAffected === 1)
            );
    }
}
