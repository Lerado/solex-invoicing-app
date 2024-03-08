import { ChangeDetectionStrategy, Component, Signal, WritableSignal, input, signal, viewChild } from '@angular/core';
import { ShipmentPackageService } from 'app/core/shipment-package/shipment-package.service';
import { Router, RouterLink } from '@angular/router';
import { ShipmentPackageFormComponent } from 'app/modules/shipment-packages/components/shipment-package-form/shipment-package-form.component';
import { CreateShipmentPackageDto } from 'app/core/shipment-package/shipment-package.dto';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Shipment } from 'app/core/shipment/shipment.types';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, map, startWith, switchMap } from 'rxjs';
import { ShipmentService } from 'app/core/shipment/shipment.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'sia-shipment-creation-page',
    standalone: true,
    imports: [RouterLink, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatIconModule, MatButtonModule, ShipmentPackageFormComponent, DatePipe, CurrencyPipe, DecimalPipe],
    templateUrl: './shipment-package-creation-page.component.html',
    styles: ':host { display: block;}',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipmentPackageCreationPageComponent {

    shipmentPackageFormEl = viewChild.required(ShipmentPackageFormComponent);

    shipmentNumber = input<string>(); // Route query param

    shipmentPackageForm = new FormControl<Partial<CreateShipmentPackageDto> | CreateShipmentPackageDto>(null, Validators.required);
    shipmentSearchControl = new FormControl<string>('', Validators.required);
    shipmentControl = new FormControl<Shipment>(null, Validators.required);

    filteredShipments: Signal<Shipment[]> = toSignal(this.shipmentSearchControl.valueChanges.pipe(
        startWith(''),
        distinctUntilChanged(),
        debounceTime(300),
        filter(value => value.length >= 2),
        switchMap((search: string) => this._shipmentService.getAll({ paginate: false }, {}, search)),
        map(({ items }) => items)
    ), { initialValue: [] });

    selectedShipment = toSignal(this.shipmentControl.valueChanges);

    /**
     * Constructor
     */
    constructor(
        private readonly _shipmentPackageService: ShipmentPackageService,
        private readonly _shipmentService: ShipmentService,
        private readonly _router: Router
    ) {
        // Report selected shipment change to form control
        this.shipmentControl.valueChanges.pipe(takeUntilDestroyed())
            .subscribe({
                next: ({ id: shipmentId }) => this.shipmentPackageForm.patchValue({ shipmentId })
            });
        // Report route query param to selected shipment
        toObservable(this.shipmentNumber).pipe(
            takeUntilDestroyed(),
            filter(value => !!value),
            switchMap(shipmentNumber => this._shipmentService.getByNumber(shipmentNumber))
        )
            .subscribe({
                next: queriedShipment => this.shipmentControl.setValue(queriedShipment)
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create shipment package and store it on the backend
     *
     * @param stayOnPage
     */
    createShipmentPackage(stayOnPage: boolean = false): void {

        if (this.shipmentPackageForm.invalid) { return; }

        this.shipmentPackageForm.disable();
        this.shipmentSearchControl.disable();

        this._shipmentPackageService.create(this.shipmentPackageForm.getRawValue() as CreateShipmentPackageDto)
            .pipe(
                switchMap(shipmentPackage => this._shipmentService.get(shipmentPackage.shipmentId)),
            )
            .subscribe({
                next: (updatedShipment) => {
                    if (!stayOnPage) {
                        return this._router.navigate(['/packages']);
                    }
                    // Reset package form
                    this.shipmentPackageFormEl().reset();
                    // Set new value
                    this.shipmentControl.setValue(updatedShipment);
                },
                complete: () => {
                    this.shipmentPackageForm.enable();
                    this.shipmentSearchControl.enable();
                }
            });
    }

    /**
     * Display shipment number in autocomplete
     *
     * @param value
     */
    displayShipmentNumber(value: Shipment): string {
        return value?.number ?? '';
    }
}
