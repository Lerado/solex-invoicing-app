import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { Component, effect, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FuseLoadingService } from '@fuse/services/loading';

@Component({
    selector: 'fuse-loading-bar',
    templateUrl: './loading-bar.component.html',
    styleUrls: ['./loading-bar.component.scss'],
    exportAs: 'fuseLoadingBar',
    imports: [MatProgressBarModule]
})
export class FuseLoadingBarComponent {

    private readonly _fuseLoadingService = inject(FuseLoadingService);

    readonly autoMode = input<boolean>(true);

    mode = toSignal(this._fuseLoadingService.mode$);
    progress = toSignal(this._fuseLoadingService.progress$);
    show = toSignal(this._fuseLoadingService.show$);

    /** Inserted by Angular inject() migration for backwards compatibility */
    constructor(...args: unknown[]);

    /**
     * Constructor
     */
    constructor() {
        effect(() => {
            // Set the auto mode in the service
            this._fuseLoadingService.setAutoMode(coerceBooleanProperty(this.autoMode()));
        })
    }
}
