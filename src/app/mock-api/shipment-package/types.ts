import { CreateShipmentPackageDto } from 'app/core/shipment-package/shipment-package.dto';
import { ShipmentPackage } from 'app/core/shipment-package/shipment-package.types';

export type ShipmentPackageModel = Readonly<ShipmentPackage>;

export type CreateShipmentPackageModelDto = Readonly<CreateShipmentPackageDto>;
