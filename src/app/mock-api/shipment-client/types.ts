import { ShipmentClientRole } from 'app/core/shipment/shipment.types';

export interface CreateShipmentClientModelDto {
    shipmentId: number;
    clientId: number;
    role: ShipmentClientRole
}
