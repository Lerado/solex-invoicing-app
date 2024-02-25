import { MatTableDataSource } from '@angular/material/table';
import { objectToFlatString } from '@lerado/typescript-toolbox';
import { Shipment } from 'app/core/shipment/shipment.types';

class ShipmentsListDataSource extends MatTableDataSource<Shipment> {

    constructor() {
        super();
        this.filterPredicate = defaultFilterPredicate;
        this.sortingDataAccessor = defaultSortingDataAccessor;
    }
}

export default ShipmentsListDataSource;

export const defaultSortingDataAccessor = (shipment: Shipment, sortHeaderId: string): string | number => {
    switch (sortHeaderId) {
        default:
            return shipment[sortHeaderId];
            break;
    }
};

export const defaultFilterPredicate = (shipment: Shipment, filter: string): boolean => {
    // Serialize
    const serialize = objectToFlatString({ ...shipment, id: null });
    // Then look for the needle
    return serialize.includes(filter.toLowerCase());
};
