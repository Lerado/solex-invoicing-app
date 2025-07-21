import { ChangeDetectionStrategy, Component, computed, effect, inject, LOCALE_ID } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validator, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CreateShipmentInfoDto } from 'app/core/shipment/shipment.dto';
import { DateTime } from 'luxon';
import { DecimalPipe, formatDate, TitleCasePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ShipmentService } from 'app/core/shipment/shipment.service';
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
    templateUrl: './shipment-info-form.component.html',
    styles: ':host { display: block;}',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipmentInfoFormComponent implements ControlValueAccessor, Validator {

    private readonly _formBuilder = inject(NonNullableFormBuilder);
    private readonly _countryService = inject(CountryService);
    private readonly _cityService = inject(CityService);
    private readonly _shipmentService = inject(ShipmentService);
    private readonly _userService = inject(UserService);

    readonly countries = this._countryService.getCountries();
    readonly cities = this._cityService.getCities();

    readonly nextShipmentReference = toSignal(this._shipmentService.getNextReference());
    readonly user = toSignal(this._userService.user$);

    readonly shipmentInfoForm = this._formBuilder.group({
        // number: ['', [Validators.required, Validators.pattern('^[A-Z]{3}[0-9]{7}')]],
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

    /**
     * Constructor
     */
    constructor() {
        // Initialize destination city with the city of the current cashier account
        effect(() => this.shipmentInfoForm.patchValue({ deliveryCityCode: this.user().cityCode }));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onTouched: CallableFunction = (): void => { };

    writeValue(value: CreateShipmentInfoDto): void {
        if (!value) { return; }
        this.shipmentInfoForm.patchValue({ ...value });
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
