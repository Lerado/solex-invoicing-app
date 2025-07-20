import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TableListAction } from './table-list-actions.types';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'sia-table-list-actions',
    imports: [MatIconModule, MatTooltipModule],
    templateUrl: './table-list-actions.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableListActionsComponent {

    readonly subject = input.required<unknown>();
    readonly actions = input.required<TableListAction[]>();

    readonly trigger = output<string>();
}
