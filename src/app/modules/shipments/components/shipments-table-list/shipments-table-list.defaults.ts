import { MatTableDataSource } from '@angular/material/table';
import { Shipment } from 'app/core/shipment/shipment.types';
import { defaultFilterPredicate, defaultSortingDataAccessor } from 'app/mock-api/shipment/api';

class ShipmentsListDataSource extends MatTableDataSource<Shipment> {

    constructor() {
        super();
        this.filterPredicate = defaultFilterPredicate;
        this.sortingDataAccessor = defaultSortingDataAccessor;
    }
}

export default ShipmentsListDataSource;
