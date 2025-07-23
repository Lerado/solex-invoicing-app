import { ChangeDetectionStrategy, Component, computed, effect, inject, input, LOCALE_ID } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validator, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CreateShipmentInfoDto, UpdateShipmentInfoDto } from 'app/core/shipment/shipment.dto';
import { DateTime } from 'luxon';
import { DecimalPipe, formatDate, TitleCasePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSelectModule } from '@angular/material/select';
import { CityService } from 'app/core/city/city.service';
import { CountryService } from 'app/core/country/country.service';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector: 'sia-shipment-info-form',
    imports: [ReactiveFormsModule, MatButtonToggleModule, MatDatepickerModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatIconModule, TitleCasePipe, DecimalPipe],
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
    host: {
        '(blur)': 'onTouched()'
    },
    templateUrl: './shipment-info-form.component.html',
    styles: ':host { display: block;}',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipmentInfoFormComponent implements ControlValueAccessor, Validator {

    private readonly _formBuilder = inject(FormBuilder);
    private readonly _countryService = inject(CountryService);
    private readonly _cityService = inject(CityService);
    private readonly _userService = inject(UserService);

    readonly countries = this._countryService.getCountries();
    readonly cities = this._cityService.getCities();

    readonly shipmentUUID = input<string>('');

    readonly user = toSignal(this._userService.user$);

    readonly shipmentInfoForm = this._formBuilder.nonNullable.group({
        // number: ['', [Validators.required, Validators.pattern('^[A-Z]{3}[0-9]{7}')]],
        id: this._formBuilder.control<number | null>({ value: null, disabled: true }, Validators.required),
        pickupDate: [DateTime.now().toISODate(), Validators.required],
        pickupTime: [formatDate(new Date(), 'HH:mm', inject(LOCALE_ID)), Validators.required],
        deliveryCountryCode: ['CM', Validators.required],
        deliveryCityCode: ['', Validators.required],
        deliveryAddress: [''],
        bundledLength: [1, [Validators.required, Validators.min(0.01)]],
        bundledWidth: [1, [Validators.required, Validators.min(0.01)]],
        bundledHeight: [1, [Validators.required, Validators.min(0.01)]],
        totalWeight: [1, [Validators.required, Validators.min(0.01)]],
        totalPrice: this._formBuilder.control<number | null>(null, [Validators.required, Validators.min(0.01)])
    });

    private readonly _initiallyDisabledControls: string[] = [];

    private readonly _shipmentHeightChanges = toSignal(this.shipmentInfoForm.controls.bundledHeight.valueChanges, { initialValue: this.shipmentInfoForm.getRawValue().bundledHeight });
    private readonly _shipmentWidthChanges = toSignal(this.shipmentInfoForm.controls.bundledWidth.valueChanges, { initialValue: this.shipmentInfoForm.getRawValue().bundledWidth });
    private readonly _shipmentLengthChanges = toSignal(this.shipmentInfoForm.controls.bundledLength.valueChanges, { initialValue: this.shipmentInfoForm.getRawValue().bundledLength });
    readonly shipmentWeightChanges = toSignal(this.shipmentInfoForm.controls.totalWeight.valueChanges, { initialValue: this.shipmentInfoForm.getRawValue().totalWeight });
    readonly shipmentVolume = computed(() => this._shipmentHeightChanges() * this._shipmentWidthChanges() * this._shipmentLengthChanges());
    readonly shipmentVolumetricWeight = computed(() => this.shipmentVolume() * 500);
    /**
     * Computes the final shipment weight by comparing the volumetric weight and the actual weight.
     * Returns the greater of the two values to ensure accurate shipping calculations.
     *
     * @readonly
     * @returns {number} The final shipment weight, which is the maximum of the volumetric weight and the actual weight.
     */
    readonly shipmentFinalWeight = computed(() => Math.max(this.shipmentVolumetricWeight(), this.shipmentWeightChanges()));

    onChange: CallableFunction = (value: any): void => { };
    onTouched: CallableFunction = (): void => { };

    /**
     * Constructor
     */
    constructor() {
        // Initialize destination city with the city of the current cashier account
        effect(() => this.shipmentInfoForm.patchValue({ deliveryCityCode: this.user().cityCode }));
        // Emit changes to parent
        this.shipmentInfoForm.valueChanges.subscribe(() => this.onChange(this.shipmentInfoForm.value));

        // Disabled field keys
        for (const [key] of Object.entries(this.shipmentInfoForm.controls)) {
            const isInitiallyDisabled = this.shipmentInfoForm.get(key)?.disabled;
            if (isInitiallyDisabled) {
                this._initiallyDisabledControls.push(key);
            }
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    writeValue(value: CreateShipmentInfoDto | UpdateShipmentInfoDto): void {
        if (!value) { return; }
        // Enable id field if it is filled
        if ((value as UpdateShipmentInfoDto).id) {
            this.shipmentInfoForm.controls.id.enable({ emitEvent: false });
        }
        this.shipmentInfoForm.reset(value);
    }

    registerOnChange(fn: CallableFunction): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: CallableFunction): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        for (const [key, control] of Object.entries(this.shipmentInfoForm.controls)) {
            const isInitiallyDisabled = this._initiallyDisabledControls.includes(key);
            if (isDisabled) {
                control.disable();
            } else if (!isInitiallyDisabled) {
                control.enable();
            }
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
