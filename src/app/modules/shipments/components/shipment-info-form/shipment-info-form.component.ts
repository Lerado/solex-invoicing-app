import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validator, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CreateShipmentInfoDto } from 'app/core/shipment/shipment.dto';
import { DateTime } from 'luxon';
import { formatDate } from '@angular/common';

@Component({
    selector: 'sia-shipment-info-form',
    standalone: true,
    imports: [ReactiveFormsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatIconModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: ShipmentInfoFormComponent,
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: ShipmentInfoFormComponent,
            multi: true
        }
    ],
    templateUrl: './shipment-info-form.component.html',
    styles: ':host { display: block;}',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipmentInfoFormComponent implements ControlValueAccessor, Validator {

    shipmentInfoForm = this._formBuilder.group({
        number: ['', [Validators.required, Validators.pattern('^[0-9]{7}[A-Z]{3}')]],
        pickupDate: new FormControl<DateTime<true>>(DateTime.now(), Validators.required),
        pickupTime: [formatDate(new Date(), 'hh:mm', 'fr'), Validators.required],
    });

    /**
     * Constructor
     */
    constructor(
        private readonly _formBuilder: NonNullableFormBuilder
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onTouched: CallableFunction = (): void => { };

    writeValue(value: CreateShipmentInfoDto): void {
        if (!value) { return; }
        this.shipmentInfoForm.patchValue({
            ...value,
            pickupDate: DateTime.fromMillis(value.pickupDate) as DateTime<true>
        });
    }

    registerOnChange(fn: CallableFunction): void {
        this.shipmentInfoForm
            .valueChanges
            .subscribe({ next: value => fn(value) });
    }

    registerOnTouched(fn: CallableFunction): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled) {
            this.shipmentInfoForm.disable();
        }
        else {
            this.shipmentInfoForm.enable();
        }

    }

    validate(): ValidationErrors {

        if (this.shipmentInfoForm.valid) {
            return null;
        }

        return Object.entries(this.shipmentInfoForm.controls).reduce((previousErrors, [currentControlName, currentControl]) => {
            const errors = { ...previousErrors };
            const controlErrors = currentControl.errors;
            if (controlErrors) {
                errors[currentControlName] = controlErrors;
            }
            return errors;
        }, {});
    }
}
