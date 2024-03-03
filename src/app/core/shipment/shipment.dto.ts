interface CreateShipmentAddressDto {
    firstName: string;
    lastName: string;
    country: string;
    contact: string;
    cityId: number;
    address: string;
}

interface CreateShipmentInfoDto {
    number: string;
    pickupDate: number;
    pickupTime: string;
}


type CreateShipmentDto = CreateShipmentInfoDto & { from: CreateShipmentAddressDto; to: CreateShipmentAddressDto };

export { CreateShipmentAddressDto, CreateShipmentInfoDto, CreateShipmentDto };
