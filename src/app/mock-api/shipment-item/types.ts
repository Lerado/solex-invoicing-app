import { CreateShipmentItemDto } from 'app/core/shipment/shipment.dto';

export type CreateShipmentItemModelDto = Readonly<CreateShipmentItemDto> & { shipmentId: number };
