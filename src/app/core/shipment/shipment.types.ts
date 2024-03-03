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
}

interface Shipper {
    readonly cityId: number
    city?: City
}

type Recipient = Shipper;

interface City {
    readonly name: string;
}

export { Shipment };
