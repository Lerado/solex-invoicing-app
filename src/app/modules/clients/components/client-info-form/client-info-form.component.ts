import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreateClientDto, UpdateClientDto } from 'app/core/client/client.dto';

@Component({
    selector: 'sia-client-info-form',
    imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: ClientInfoFormComponent,
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            multi: true,
            useExisting: ClientInfoFormComponent
        }
    ],
    host: {
        '(blur)': 'onTouched()'
    },
    templateUrl: './client-info-form.component.html',
    styles: ':host { display: block;}',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientInfoFormComponent implements ControlValueAccessor, Validator {

    private readonly _formBuilder = inject(FormBuilder);

    clientForm = this._formBuilder.nonNullable.group({
        id: this._formBuilder.control<number | null>({ value: null, disabled: true }, Validators.required),
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        contact: ['', Validators.required],
        address: ['', Validators.required]
    });

    private readonly _initiallyDisabledControls: string[] = [];

    onTouched: CallableFunction = (): void => { };
    onChange: CallableFunction = (value: any): void => { };

    /**
     * Constructor
     */
    constructor() {
        this.clientForm.valueChanges.subscribe(() => this.onChange(this.clientForm.value));
        // Disabled field keys
        for (const [key] of Object.entries(this.clientForm.controls)) {
            const isInitiallyDisabled = this.clientForm.get(key)?.disabled;
            if (isInitiallyDisabled) {
                this._initiallyDisabledControls.push(key);
            }
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    writeValue(value: CreateClientDto | UpdateClientDto): void {
        if (value === null || value === undefined) { return; }
        // Enable id field if it is filled
        if ((value as UpdateClientDto).id) {
            this.clientForm.controls.id.enable({ emitEvent: false });
        }
        this.clientForm.reset(value);
    }

    registerOnChange(fn: CallableFunction): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: CallableFunction): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        for (const [key, control] of Object.entries(this.clientForm.controls)) {
            const isInitiallyDisabled = this._initiallyDisabledControls.includes(key);
            if (isDisabled) {
                control.disable();
            } else if (!isInitiallyDisabled) {
                control.enable();
            }
        }
    }

    reset = () => this.clientForm.reset();

    validate(): ValidationErrors {

        if (this.clientForm.valid) {
            return null;
        }

        return Object.entries(this.clientForm.controls).reduce((previousErrors, [currentControlName, currentControl]) => {
            const errors = { ...previousErrors };
            const controlErrors = currentControl.errors;
            if (controlErrors) {
                errors[currentControlName] = controlErrors;
            }
            return errors;
        }, {});
    }
}
