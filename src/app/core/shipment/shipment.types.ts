import { City } from '../city/city.types';
import { Client } from '../client/client.types';

export interface Shipment {
    readonly id: number;
    readonly number: string;

    pickupDate: number;
    pickupTime: string;

    items?: ShipmentItem[];
    itemsCount?: number;
    from?: Client;
    to?: Client;
    deliveryCity?: City;

    totalPrice: number;
    totalWeight: number;
    bundledLength: number;
    bundledWidth: number;
    bundledHeight: number;
    volumetricWeight: number;
    finalWeight: number;

    deliveryCountryCode: string;
    deliveryCityCode: string;
    deliveryAddress: string;

    readonly createdAt: number;
    readonly updatedAt: number;
    readonly deletedAt: number;
}

export interface ShipmentItem {
    id: number;
    shipmentId: number;
    designation: string;
    quantity: number;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
}

export enum ShipmentClientRole {
    Sender = 'sender',
    Receiver = 'receiver'
}

export interface ShipmentClient {
    id: number;
    shipmentId: number;
    shipment?: Shipment;
    clientId: number;
    client?: Client;
    role: ShipmentClientRole;
    createdAt: number;
    updatedAt: number;
    deletedAt: number;
}
