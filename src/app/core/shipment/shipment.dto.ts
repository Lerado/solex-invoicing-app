export interface CreateShipmentInfoDto {
    pickupDate: string;
    pickupTime: string;
    deliveryCountryCode: string;
    deliveryCityCode: string;
    deliveryAddress: string;
    bundledLength: number;
    bundledWidth: number;
    bundledHeight: number;
    totalWeight: number;
    totalPrice: number;
}

export type UpdateShipmentInfoDto = Partial<CreateShipmentInfoDto> & { id: number };

export interface CreateShipmentItemDto {
    designation: string;
    quantity: number;
}

export type UpdateShipmentItemDto = Partial<CreateShipmentItemDto> & { id: number };

export interface CreateShipmentDto {
    shipment: CreateShipmentInfoDto;
    from: number;
    to: number;
    items: CreateShipmentItemDto[]
}

export interface UpdateShipmentDto {
    shipment?: UpdateShipmentInfoDto;
    from?: number;
    to?: number;
    items?: Array<Partial<CreateShipmentItemDto> | UpdateShipmentItemDto>
}
