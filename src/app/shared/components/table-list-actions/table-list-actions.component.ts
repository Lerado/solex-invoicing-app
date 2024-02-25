import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TableListAction } from './table-list-actions.types';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'table-list-actions',
    standalone: true,
    imports: [MatIconModule, MatTooltipModule],
    templateUrl: './table-list-actions.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableListActionsComponent {

    @Input({ required: true }) readonly subject: unknown;
    @Input({ required: true }) actions: TableListAction[];

    @Output() trigger: EventEmitter<string> = new EventEmitter<string>();
}
