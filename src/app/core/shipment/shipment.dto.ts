export interface CreateShipmentInfoDto {
    pickupDate: string;
    pickupTime: string;
    countryCode: string;
    cityCode: string;
    deliveryAddress: string;
    bundledLength: number;
    bundledWidth: number;
    bundledHeight: number;
    totalWeight: number;
    totalPrice: number;
}

export interface CreateShipmentItemDto {
    designation: string;
    quantity: number;
}

export interface CreateShipmentDto {
    shipment: CreateShipmentInfoDto;
    from: number;
    to: number;
    items: CreateShipmentItemDto[]
}
