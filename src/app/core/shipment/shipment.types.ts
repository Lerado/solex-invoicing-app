import { ShipmentPackage } from 'app/core/shipment-package/shipment-package.types';

interface Shipment {

    readonly id: number;
    readonly number: string;

    pickupDate: number;
    pickupTime: string;

    packages?: ShipmentPackage[];
    packagesCount?: number;

    from: Recipient;
    to: Recipient;

    totalPrice: number;

    readonly createdAt: number;
    readonly updatedAt: number;
    readonly deletedAt: number;
}

interface Shipper {

    readonly id: number;

    readonly shipmentId: number;

    readonly cityId: number
    city?: City,

    firstName: string;
    lastName: string;
    country: string;
    contact: string;
    address: string;

    readonly createdAt: number;
    readonly updatedAt: number;
    readonly deletedAt: number;
}

type Recipient = Shipper;

interface City {
    readonly name: string;
}

export { Shipment };
