import { ChangeDetectionStrategy, Component, EventEmitter, Output, booleanAttribute, input } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { ShipmentAddressFormComponent } from '../shipment-address-form/shipment-address-form.component';
import { CreateShipmentAddressDto, CreateShipmentDto, CreateShipmentInfoDto } from 'app/core/shipment/shipment.dto';
import { Country } from 'app/core/country/country.types';
import { City } from 'app/core/city/city.types';
import { MatButtonModule } from '@angular/material/button';
import { ShipmentInfoFormComponent } from '../shipment-info-form/shipment-info-form.component';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { DateTime } from 'luxon';

@Component({
    selector: 'sia-shipment-creation-stepper',
    standalone: true,
    imports: [ReactiveFormsModule, MatButtonModule, MatStepperModule, ShipmentAddressFormComponent, ShipmentInfoFormComponent],
    templateUrl: './shipment-creation-stepper.component.html',
    styles: ':host { display: block;}',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipmentCreationStepperComponent {

    countries = input.required<Country[]>();
    cities = input.required<City[]>();
    disabled = input(false, { transform: booleanAttribute });

    @Output() submitChanges = new EventEmitter<CreateShipmentDto>();

    shipmentCreationForm = this._formBuilder.group({
        from: new FormControl<CreateShipmentAddressDto>(null, Validators.required),
        to: new FormControl<CreateShipmentAddressDto>(null, Validators.required),
        info: new FormControl<CreateShipmentInfoDto & { pickupDate: DateTime<true> }>(null, Validators.required),
    });

    disabledChange$ = toObservable(this.disabled);

    /**
     * Constructor
     */
    constructor(
        private readonly _formBuilder: NonNullableFormBuilder,
    ) {
        // Update form disabled status
        this.disabledChange$.pipe(takeUntilDestroyed())
            .subscribe({
                next: (isDisabled) => {
                    if (isDisabled) {
                        this.shipmentCreationForm.disable();
                    }
                    else {
                        this.shipmentCreationForm.enable();
                    }
                }
            });

        // Leave or stay after submission
        // this.submitChanges.pipe(takeUntilDestroyed())
        //     .subscribe({
        //         next: () => this._continueOrLeave()
        //     });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Submit form
     */
    submit(): void {

        if (this.shipmentCreationForm.invalid) { return; }

        const { info, to, from } = this.shipmentCreationForm.getRawValue();

        this.submitChanges.emit({
            ...info,
            pickupDate: info.pickupDate.toMillis(),
            to,
            from
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Should we continue to create shipments or leave
     */
    // private _continueOrLeave(): void {
    //     this._fuseConfirmationService.open({
    //         title: 'Quitter ?',
    //         message: 'Voudriez-vous ajouter un nouveau colis à cette expédition ?'
    //     })
    //         .afterClosed()
    //         .subscribe();
    // }
}
