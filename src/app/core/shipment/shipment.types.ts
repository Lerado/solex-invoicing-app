interface Shipment {

    readonly id: number;

    readonly number: string;
    readonly designation: string;
    readonly quantity: number;
    readonly weight: number;
    readonly price: number;
    readonly totalPrice: number;

    from: Recipient;
    to: Recipient;

    readonly createdAt: number;
}

interface Shipper {
    city: City
}

type Recipient = Shipper;

interface City {
    readonly name: string;
}

export { Shipment };
