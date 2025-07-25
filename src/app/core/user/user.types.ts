import { City } from 'app/core/city/city.types';

export interface User {
    readonly id: number;
    cashierReference: string;
    cashierName: string;
    countryCode: string;
    cityCode: string;
    city?: City;
    agencyPhone: string;
    status?: string;
    avatar?: string;
    readonly createdAt: number;
    readonly updatedAt: number;
    readonly deletedAt: number;
}
