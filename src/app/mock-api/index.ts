import { AuthMockApi } from './auth/api';
import { CityMockApi } from './city/api';
import { ShipmentPackageMockApi } from './shipment-package/api';
import { ShipmentMockApi } from './shipment/api';
import { UserMockApi } from './user/api';

export const mockApiServices = [
    AuthMockApi,
    UserMockApi,
    ShipmentMockApi,
    ShipmentPackageMockApi,
    CityMockApi
];
