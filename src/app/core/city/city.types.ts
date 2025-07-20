interface City {
    readonly id: number;

    name: string;
    countryCode: string;
    cityCode: string;

    readonly createdAt: number;
    readonly updatedAt: number;
    readonly deletedAt: number;
}

export { City };
