import { CreateShipmentDto } from 'app/core/shipment/shipment.dto';
import { Shipment } from 'app/core/shipment/shipment.types';

export type ShipmentModel = Readonly<Shipment>;

export type CreateShipmentModelDto = Readonly<CreateShipmentDto> & { totalPrice: number };
