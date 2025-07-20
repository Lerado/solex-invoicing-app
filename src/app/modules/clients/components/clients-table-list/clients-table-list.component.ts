import { DragDropModule } from '@angular/cdk/drag-drop';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Client } from 'app/core/client/client.types';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { PhoneNumberPipe } from 'app/shared/pipes/phone-number.pipe';

@Component({
    selector: 'sia-clients-table-list',
    imports: [MatTableModule, MatSortModule, DragDropModule, MatProgressSpinnerModule, DatePipe, PhoneNumberPipe],
    templateUrl: './clients-table-list.component.html',
    styles: ':host { display: block; }',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientsTableListComponent extends TableListBaseComponent<Client> { }
