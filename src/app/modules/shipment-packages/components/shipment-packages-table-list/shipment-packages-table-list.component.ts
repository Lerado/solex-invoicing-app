import { DragDropModule } from '@angular/cdk/drag-drop';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ShipmentPackage } from 'app/core/shipment-package/shipment-package.types';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';

/**
 * @deprecated
 */
@Component({
    selector: 'sia-shipment-packages-table-list',
    imports: [MatTableModule, MatSortModule, DragDropModule, MatProgressSpinnerModule, DatePipe, DecimalPipe, CurrencyPipe],
    templateUrl: './shipment-packages-table-list.component.html',
    styles: ':host { display: block; }',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipmentPackagesTableListComponent extends TableListBaseComponent<ShipmentPackage> { }
