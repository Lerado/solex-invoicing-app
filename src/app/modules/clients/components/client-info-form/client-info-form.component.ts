import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validator, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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

    private readonly _formBuilder = inject(NonNullableFormBuilder);

    clientForm = this._formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        contact: ['', Validators.required],
        address: ['', Validators.required]
    });

    onTouched: CallableFunction = (): void => { };

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    writeValue(value: unknown): void {
        if (value === null || value === undefined) { return; }
        this.clientForm.patchValue(value);
    }

    registerOnChange(fn: CallableFunction): void {
        this.clientForm
            .valueChanges
            .subscribe({ next: value => fn(value) });
    }

    registerOnTouched(fn: CallableFunction): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        if (isDisabled) {
            this.clientForm.disable();
        }
        else {
            this.clientForm.enable();
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
