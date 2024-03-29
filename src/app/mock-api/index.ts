import { AuthMockApi } from './auth/api';
import { CityMockApi } from './city/api';
import { CityApiStore } from './city/store';
import { ShipmentPackageMockApi } from './shipment-package/api';
import { ShipmentPackageApiStore } from './shipment-package/store';
import { ShipmentMockApi } from './shipment/api';
import { ShipmentApiStore } from './shipment/store';
import { UserMockApi } from './user/api';
import { UserApiStore } from './user/store';

export const mockApiServices = [
    AuthMockApi,
    UserMockApi,
    ShipmentMockApi,
    ShipmentPackageMockApi,
    CityMockApi
];

export const mockApiStores = [
    UserApiStore,
    ShipmentApiStore,
    ShipmentPackageApiStore,
    CityApiStore
];
