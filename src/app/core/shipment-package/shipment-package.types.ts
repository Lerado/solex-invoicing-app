import { Shipment } from 'app/core/shipment/shipment.types';

interface ShipmentPackage {

    readonly id: number;

    readonly shipmentId: number;
    readonly shipment?: Shipment;

    readonly designation: string;
    readonly quantity: number;
    readonly weight: number;
    readonly price: number;
    readonly totalPrice: number;

    readonly createdAt: number;
}

export { ShipmentPackage };
