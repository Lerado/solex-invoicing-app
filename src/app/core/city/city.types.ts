interface City {
    readonly id: number;

    name: string;
    country: string;

    readonly createdAt: number;
    readonly updatedAt: number;
    readonly deletedAt: number;
}

export { City };
