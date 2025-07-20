import { MatTableDataSource } from '@angular/material/table';
import { ShipmentPackage } from 'app/core/shipment-package/shipment-package.types';
import { defaultFilterPredicate, defaultSortingDataAccessor } from 'app/mock-api/shipment-package/api';

/**
 * @deprecated
 */
class ShipmentPackagesListDataSource extends MatTableDataSource<ShipmentPackage> {

    constructor() {
        super();
        this.filterPredicate = defaultFilterPredicate;
        this.sortingDataAccessor = defaultSortingDataAccessor;
    }
}

export default ShipmentPackagesListDataSource;
