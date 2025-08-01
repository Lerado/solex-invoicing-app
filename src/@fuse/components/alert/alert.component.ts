import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation, inject, input, model, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertService } from '@fuse/components/alert/alert.service';
import { FuseAlertAppearance, FuseAlertType } from '@fuse/components/alert/alert.types';
import { FuseUtilsService } from '@fuse/services/utils/utils.service';
import { filter, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'fuse-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    exportAs: 'fuseAlert',
    imports: [MatIconModule, MatButtonModule]
})
export class FuseAlertComponent implements OnChanges, OnInit, OnDestroy
{
    private _changeDetectorRef = inject(ChangeDetectorRef);
    private _fuseAlertService = inject(FuseAlertService);
    private _fuseUtilsService = inject(FuseUtilsService);

    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_dismissible: BooleanInput;
    static ngAcceptInputType_dismissed: BooleanInput;
    static ngAcceptInputType_showIcon: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    readonly appearance = input<FuseAlertAppearance>('soft');
    readonly dismissed = model<boolean>(false);
    readonly dismissible = model<boolean>(false);
    readonly name = input<string>(this._fuseUtilsService.randomId());
    readonly showIcon = model<boolean>(true);
    readonly type = input<FuseAlertType>('primary');
    readonly dismissedChanged = output<boolean>();

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /** Inserted by Angular inject() migration for backwards compatibility */
    constructor(...args: unknown[]);

    /**
     * Constructor
     */
    constructor()
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Host binding for component classes
     */
    @HostBinding('class') get classList(): any
    {
        /* eslint-disable @typescript-eslint/naming-convention */
        return {
            'fuse-alert-appearance-border' : this.appearance() === 'border',
            'fuse-alert-appearance-fill'   : this.appearance() === 'fill',
            'fuse-alert-appearance-outline': this.appearance() === 'outline',
            'fuse-alert-appearance-soft'   : this.appearance() === 'soft',
            'fuse-alert-dismissed'         : this.dismissed(),
            'fuse-alert-dismissible'       : this.dismissible(),
            'fuse-alert-show-icon'         : this.showIcon(),
            'fuse-alert-type-primary'      : this.type() === 'primary',
            'fuse-alert-type-accent'       : this.type() === 'accent',
            'fuse-alert-type-warn'         : this.type() === 'warn',
            'fuse-alert-type-basic'        : this.type() === 'basic',
            'fuse-alert-type-info'         : this.type() === 'info',
            'fuse-alert-type-success'      : this.type() === 'success',
            'fuse-alert-type-warning'      : this.type() === 'warning',
            'fuse-alert-type-error'        : this.type() === 'error',
        };
        /* eslint-enable @typescript-eslint/naming-convention */
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void
    {
        // Dismissed
        if ( 'dismissed' in changes )
        {
            // Coerce the value to a boolean
            this.dismissed.set(coerceBooleanProperty(changes.dismissed.currentValue));

            // Dismiss/show the alert
            this._toggleDismiss(this.dismissed());
        }

        // Dismissible
        if ( 'dismissible' in changes )
        {
            // Coerce the value to a boolean
            this.dismissible.set(coerceBooleanProperty(changes.dismissible.currentValue));
        }

        // Show icon
        if ( 'showIcon' in changes )
        {
            // Coerce the value to a boolean
            this.showIcon.set(coerceBooleanProperty(changes.showIcon.currentValue));
        }
    }

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to the dismiss calls
        this._fuseAlertService.onDismiss
            .pipe(
                filter(name => this.name() === name),
                takeUntil(this._unsubscribeAll),
            )
            .subscribe(() =>
            {
                // Dismiss the alert
                this.dismiss();
            });

        // Subscribe to the show calls
        this._fuseAlertService.onShow
            .pipe(
                filter(name => this.name() === name),
                takeUntil(this._unsubscribeAll),
            )
            .subscribe(() =>
            {
                // Show the alert
                this.show();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Dismiss the alert
     */
    dismiss(): void
    {
        // Return if the alert is already dismissed
        if ( this.dismissed() )
        {
            return;
        }

        // Dismiss the alert
        this._toggleDismiss(true);
    }

    /**
     * Show the dismissed alert
     */
    show(): void
    {
        // Return if the alert is already showing
        if ( !this.dismissed() )
        {
            return;
        }

        // Show the alert
        this._toggleDismiss(false);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Dismiss/show the alert
     *
     * @param dismissed
     * @private
     */
    private _toggleDismiss(dismissed: boolean): void
    {
        // Return if the alert is not dismissible
        if ( !this.dismissible() )
        {
            return;
        }

        // Set the dismissed
        this.dismissed.set(dismissed);

        // Execute the observable
        this.dismissedChanged.emit(this.dismissed());

        // Notify the change detector
        this._changeDetectorRef.markForCheck();
    }
}
