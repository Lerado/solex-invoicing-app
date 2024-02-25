import { DragDropModule } from '@angular/cdk/drag-drop';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Shipment } from 'app/core/shipment/shipment.types';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';

@Component({
    selector: 'sia-shipments-table-list',
    standalone: true,
    imports: [MatTableModule, MatSortModule, DragDropModule, MatProgressSpinnerModule, DatePipe, DecimalPipe, CurrencyPipe],
    templateUrl: './shipments-table-list.component.html',
    styles: ':host { display: block; }',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipmentsTableListComponent extends TableListBaseComponent<Shipment> { }
