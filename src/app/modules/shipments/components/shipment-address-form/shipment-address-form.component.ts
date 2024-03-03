import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validator, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { City } from 'app/core/city/city.types';
import { Country } from 'app/core/country/country.types';
import { CreateShipmentAddressDto } from 'app/core/shipment/shipment.dto';
import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { map } from 'rxjs';

@Component({
    selector: 'sia-shipment-address-form',
    standalone: true,
    imports: [ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, NgxMatIntlTelInputComponent, TitleCasePipe],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: ShipmentAddressFormComponent,
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            multi: true,
            useExisting: ShipmentAddressFormComponent
        }
    ],
    templateUrl: './shipment-address-form.component.html',
    styles: ':host { display: block;}',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipmentAddressFormComponent implements ControlValueAccessor, Validator {

    countries = input.required<Country[]>();
    cities = input.required<City[]>();

    shipmentAddressForm = this._formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        country: ['CM', Validators.required],
        contact: ['', Validators.required],
        cityId: new FormControl<number>(null, Validators.required),
        address: ['']
    });

    phoneInputCountryCode = toSignal(this.shipmentAddressForm.controls.country.valueChanges.pipe(map(value => [value.toLocaleLowerCase()])), { initialValue: [] });

    onTouched: CallableFunction = (): void => { };

    /**
     * Constructor
     */
    constructor(
        private readonly _formBuilder: NonNullableFormBuilder
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    writeValue(value: CreateShipmentAddressDto): void {
        this.shipmentAddressForm.patchValue(value);
    }

    registerOnChange(fn: CallableFunction): void {
        this.shipmentAddressForm
            .valueChanges
            .subscribe({ next: value => fn(value) })
            ;
    }

    registerOnTouched(fn: CallableFunction): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled) {
            this.shipmentAddressForm.disable();
        }
        else {
            this.shipmentAddressForm.enable();
        }

    }

    validate(): ValidationErrors {

        if (this.shipmentAddressForm.valid) {
            return null;
        }

        return Object.entries(this.shipmentAddressForm.controls).reduce((previousErrors, [currentControlName, currentControl]) => {
            const errors = { ...previousErrors };
            const controlErrors = currentControl.errors;
            if (controlErrors) {
                errors[currentControlName] = controlErrors;
            }
            return errors;
        }, {});
    }
}
