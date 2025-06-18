import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { CurrencyPipe, DatePipe, DecimalPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ShipmentPackageService } from 'app/core/shipment-package/shipment-package.service';
import { ShipmentService } from 'app/core/shipment/shipment.service';
import { UserService } from 'app/core/user/user.service';
import { PhoneNumberPipe } from 'app/shared/pipes/phone-number.pipe';
import { filter, map, switchMap } from 'rxjs';

@Component({
    selector: 'sia-shipment-printing-page',
    imports: [MatButtonModule, MatIconModule, CdkScrollableModule, NgOptimizedImage, PhoneNumberPipe, DatePipe, DecimalPipe, CurrencyPipe],
    templateUrl: './shipment-printing-page.component.html',
    styles: ':host { display: block;}',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipmentPrintingPageComponent {
    private readonly _shipmentService = inject(ShipmentService);
    private readonly _shipmentPackageService = inject(ShipmentPackageService);
    private readonly _userService = inject(UserService);


    // Route param
    shipmentId = input.required<string>();
    shipmentId$ = toObservable(this.shipmentId).pipe(filter(value => !!value));

    shipment$ = this.shipmentId$.pipe(
        switchMap(shipmentId => this._shipmentService.get(+shipmentId))
    );
    shipmentPackages$ = this.shipmentId$.pipe(
        switchMap(shipmentId => this._shipmentPackageService.getAll({ paginate: false }, {}, '', { shipmentId: +shipmentId })),
        map(result => result.items)
    );

    shipment = toSignal(this.shipment$);
    shipmentPackages = toSignal(this.shipmentPackages$, { initialValue: [] });
    user = toSignal(this._userService.user$, { requireSync: true });

    shipmentPackagesCount = computed(() => this.shipmentPackages().reduce(
        (subTotal, current) => subTotal + current.quantity,
        0
    ));
    shipmentPackagesWeightTotal = computed(() => this.shipmentPackages().reduce(
        (subTotal, current) => subTotal + current.weight,
        0
    ));
    shipmentPackagesEmptySeats = computed(() => new Array(this.shipmentPackages().length > 10 ? 0 : 10 - this.shipmentPackages().length));

    /** Inserted by Angular inject() migration for backwards compatibility */
    constructor(...args: unknown[]);

    /**
     * Constructor
     */
    constructor() { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Prints the page
     */
    print(): void {
        window.print();
    }
}
