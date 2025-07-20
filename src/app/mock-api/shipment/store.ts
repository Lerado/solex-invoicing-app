import { Observable, map, of, switchMap, throwError } from 'rxjs';
import { Store } from '../store';
import { CreateShipmentModelDto, ShipmentModel } from './types';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ShipmentApiStore extends Store {


    static readonly TABLE_NAME = 'shipments';

    private readonly ROOT_MODEL_QUERY = `
    SELECT
        json_group_array(
            json_object(
                'id', s.id,
                'number', s.number,
                'pickupDate', s.pickupDate,
                'pickupTime', s.pickupTime,
                'totalPrice', s.totalPrice,
                'totalWeight', s.totalWeight,
                'bundledLength', s.bundledLength,
                'bundledWidth', s.bundledWidth,
                'bundledHeight', s.bundledHeight,
                'volumetricWeight', s.volumetricWeight,
                'finalWeight', s.finalWeight,
                'deliveryCountryCode', s.deliveryCountryCode,
                'deliveryCityCode', s.deliveryCityCode,
                'deliveryAddress', s.deliveryAddress,
                'createdAt', s.createdAt,
                'updatedAt', s.updatedAt,
                'deletedAt', s.deletedAt,
                'itemsCount', (
                    SELECT COUNT(*)
                    FROM shipment_items si
                    WHERE si.shipmentId = s.id
                    AND si.deletedAt IS NULL
                ),
                'items', (
                    SELECT json_group_array(
                        json_object(
                            'id', si.id,
                            'shipmentId', si.shipmentId,
                            'designation', si.designation,
                            'quantity', si.quantity,
                            'createdAt', si.createdAt,
                            'updatedAt', si.updatedAt,
                            'deletedAt', si.deletedAt
                        )
                    )
                    FROM shipment_items si
                    WHERE si.shipmentId = s.id
                    AND si.deletedAt IS NULL
                ),
                'from', (
                    SELECT json_object(
                        'id', c.id,
                        'firstName', c.firstName,
                        'lastName', c.lastName,
                        'contact', c.contact,
                        'address', c.address,
                        'createdAt', c.createdAt,
                        'updatedAt', c.updatedAt,
                        'deletedAt', c.deletedAt
                    )
                    FROM shipment_clients sc
                    JOIN clients c ON sc.clientId = c.id
                    WHERE sc.shipmentId = s.id
                    AND sc.role = 'sender'
                    AND sc.deletedAt IS NULL
                    LIMIT 1
                ),
                'to', (
                    SELECT json_object(
                        'id', c.id,
                        'firstName', c.firstName,
                        'lastName', c.lastName,
                        'contact', c.contact,
                        'address', c.address,
                        'createdAt', c.createdAt,
                        'updatedAt', c.updatedAt,
                        'deletedAt', c.deletedAt
                    )
                    FROM shipment_clients sc
                    JOIN clients c ON sc.clientId = c.id
                    WHERE sc.shipmentId = s.id
                    AND sc.role = 'receiver'
                    AND sc.deletedAt IS NULL
                    LIMIT 1
                ),
                'deliveryCity', (
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
                    WHERE ct.cityCode = s.deliveryCityCode
                    AND ct.countryCode = s.deliveryCountryCode
                    AND ct.deletedAt IS NULL
                    LIMIT 1
                )
            )
        ) AS data
    FROM shipments s
    WHERE s.deletedAt IS NULL
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
            AND ${field} = ${typeof fieldValue === 'string' ? `'${fieldValue}'` : fieldValue}
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
    create(payload: CreateShipmentModelDto): Observable<number> {

        const createShipmentQuery: string = this._persistence
            .queryBuilder
            .insert({ replaceSingleQuotes: true })
            .into(ShipmentApiStore.TABLE_NAME)
            .setFields({ ...payload, createdAt: Date.now() })
            .toString();

        // Get the last
        // Create shipment first
        return this._persistence.executeQuery(createShipmentQuery)
            .pipe(
                map(({ lastInsertId }) => lastInsertId)
            );
    }

    /**
     * Counts the shipments
     */
    count(): Observable<number> {

        const shipmentsCountquery = this._persistence.queryBuilder
            .select()
            .field('COUNT(*)', 'count')
            .from(ShipmentApiStore.TABLE_NAME)
            .toString();

        return this._persistence.executeSelect<any>(shipmentsCountquery)
            .pipe(
                map(result => result.at(0).count)
            );
    }

    /**
     * Get the last shipment
     */
    lastId(): Observable<number> {

        const shipmentsCountquery = this._persistence.queryBuilder
            .select()
            .limit(1)
            .order('id', false)
            .field('id')
            .from(ShipmentApiStore.TABLE_NAME)
            .toString();

        return this._persistence.executeSelect<any>(shipmentsCountquery)
            .pipe(
                map(result => result.at(0)?.id ?? 0)
            );
    }
}
