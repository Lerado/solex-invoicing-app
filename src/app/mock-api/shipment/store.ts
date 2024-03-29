/* eslint-disable max-len */
import { Observable, forkJoin, map, of, switchMap, throwError } from 'rxjs';
import { Store } from '../store';
import { CreateShipmentModelDto, ShipmentModel } from './types';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShipmentApiStore extends Store {

    readonly TABLE_NAME = 'shipments';

    private readonly ROOT_MODEL_QUERY = `
    SELECT
        json_group_array(
            json_object(
                'id', shipments.id,
                'totalPrice', shipments.totalPrice,
                'number', shipments.number,
                'pickupTime', shipments.pickupTime,
                'pickupDate', shipments.pickupDate,
                'createdAt', shipments.createdAt,
                'updatedAt', shipments.updatedAt,
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
                ),
                'packagesCount', (
                    SELECT COUNT(*)
                    FROM shipments_packages
                    WHERE shipmentId = shipments.id
                )
            )
        ) AS data
    FROM
        shipments
    JOIN
        shipments_from ON shipments.id = shipments_from.shipmentId
    JOIN
        cities AS shipper_city ON shipments_from.cityId = shipper_city.id
    JOIN
        shipments_to ON shipments.id = shipments_to.shipmentId
    JOIN
        cities AS recipient_city ON shipments_to.cityId = recipient_city.id
    `;

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get shipment by id
     *
     * @param shipmentId
     */
    get(shipmentId: number): Observable<ShipmentModel> {
        return this.getBy('id', shipmentId);
    }

    /**
     * Get shipment by a field
     *
     * @param shipmentId
     */
    getBy(field: string, fieldValue: unknown): Observable<ShipmentModel> {
        // Build query
        const query: string = this.ROOT_MODEL_QUERY + `
            WHERE ${this.TABLE_NAME}.${field} = ${typeof fieldValue === 'string' ? `'${fieldValue}'` : fieldValue}
            LIMIT 1
        `;
        // Execute query
        return this._persistence.executeSelect<Array<{ data: string }>>(query)
            .pipe(
                map(result => JSON.parse(result.at(0).data) as ShipmentModel[]),
                switchMap((result) => {
                    if (!result.length) {
                        return throwError(() => new Error(`Shipment with ${field} ${fieldValue} not found`));
                    }
                    return of(result.at(0));
                })
            );
    }

    /**
     * Get all shipments
     */
    getAll(): Observable<ShipmentModel[]> {
        // Execute query
        return this._persistence.executeSelect<Array<{ data: string }>>(this.ROOT_MODEL_QUERY)
            .pipe(
                map(result => JSON.parse(result.at(0).data) as ShipmentModel[])
            );
    }

    /**
     * Create a new shipment
     *
     * @param payload
     */
    create(payload: CreateShipmentModelDto): Observable<boolean> {

        const { from, to, ...shipment } = payload;

        const createShipmentQuery: string = this._persistence
            .queryBuilder
            .insert({ replaceSingleQuotes: true })
            .into(this.TABLE_NAME)
            .setFields({ ...shipment, createdAt: Date.now() })
            .toString();

        // Create shipment first
        return this._persistence.executeQuery(createShipmentQuery)
            .pipe(
                switchMap(({ lastInsertId: shipmentId }) => {
                    // Then the rest
                    const createShipmentFromQuery: string = this._persistence
                        .queryBuilder
                        .insert({ replaceSingleQuotes: true })
                        .into(`${this.TABLE_NAME}_from`)
                        .setFields({ ...from, shipmentId, createdAt: Date.now() })
                        .toString();
                    const createShipmentToQuery: string = this._persistence
                        .queryBuilder
                        .insert({ replaceSingleQuotes: true })
                        .into(`${this.TABLE_NAME}_to`)
                        .setFields({ ...to, shipmentId, createdAt: Date.now() })
                        .toString();
                    return forkJoin([
                        this._persistence.executeQuery(createShipmentFromQuery),
                        this._persistence.executeQuery(createShipmentToQuery)
                    ]);
                }),
                map(() => true)
            );
    }
}
