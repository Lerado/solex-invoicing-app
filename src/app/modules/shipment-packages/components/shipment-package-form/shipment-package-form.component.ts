import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, inject } from '@angular/core';
import { toSignal, takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, NG_VALUE_ACCESSOR, NG_VALIDATORS, NonNullableFormBuilder, ValidationErrors, Validators, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CreateShipmentPackageDto } from 'app/core/shipment-package/shipment-package.dto';
import { Shipment } from 'app/core/shipment/shipment.types';
import { filter } from 'rxjs';

/**
 * @deprecated
 */
@Component({
    selector: 'sia-shipment-package-form',
    imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, CurrencyPipe],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: ShipmentPackageFormComponent,
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: ShipmentPackageFormComponent,
            multi: true
        }
    ],
    templateUrl: './shipment-package-form.component.html',
    styles: ':host { display: block;}',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipmentPackageFormComponent {
    private readonly _formBuilder = inject(NonNullableFormBuilder);


    shipment = input<Shipment>();

    shipmentPackageForm = this._formBuilder.group({
        shipmentId: new FormControl<number>(null, Validators.required),
        designation: ['', [Validators.required]],
        quantity: [1, [Validators.required, Validators.min(1)]],
        weight: [1, [Validators.required, Validators.min(1)]],
        price: [0, [Validators.required, Validators.min(1)]]
    });

    private readonly _unitaryPrice = toSignal(this.shipmentPackageForm.controls.price.valueChanges, { initialValue: 0 });
    private readonly _quantity = toSignal(this.shipmentPackageForm.controls.quantity.valueChanges, { initialValue: 0 });

    totalPrice = computed(() => this._unitaryPrice() * this._quantity());

    /**
     * Constructor
     */
    constructor() {
        // Fill form with shipment input
        toObservable(this.shipment)
            .pipe(
                takeUntilDestroyed(),
                filter(value => !!value)
            )
            .subscribe({
                next: ({ id: shipmentId }) => this.shipmentPackageForm.patchValue({ shipmentId })
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onTouched: CallableFunction = (): void => { };

    writeValue(value: CreateShipmentPackageDto): void {
        if (!value) { return; }
        this.shipmentPackageForm.patchValue(value);
    }

    registerOnChange(fn: CallableFunction): void {
        this.shipmentPackageForm
            .valueChanges
            .subscribe({ next: value => fn(value) });
    }

    registerOnTouched(fn: CallableFunction): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled) {
            this.shipmentPackageForm.disable();
        }
        else {
            this.shipmentPackageForm.enable();
        }

    }

    reset(initialValue: Partial<CreateShipmentPackageDto> = {}): void {
        this.shipmentPackageForm.reset(initialValue);
    }

    validate(): ValidationErrors {

        if (this.shipmentPackageForm.valid) {
            return null;
        }

        return Object.entries(this.shipmentPackageForm.controls).reduce((previousErrors, [currentControlName, currentControl]) => {
            const errors = { ...previousErrors };
            const controlErrors = currentControl.errors;
            if (controlErrors) {
                errors[currentControlName] = controlErrors;
            }
            return errors;
        }, {});
    }
}
