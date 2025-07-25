import { NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { Component, WritableSignal, signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { STRONG_PASSWORD_REGEXP } from '@lerado/typescript-toolbox';
import { AuthService } from 'app/core/auth/auth.service';
import { CityService } from 'app/core/city/city.service';
import { CountryService } from 'app/core/country/country.service';

@Component({
    selector: 'sia-auth-sign-up',
    templateUrl: './sign-up.component.html',
    animations: fuseAnimations,
    imports: [FuseAlertComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatSelectModule, MatProgressSpinnerModule, NgOptimizedImage, TitleCasePipe]
})
export default class AuthSignUpComponent {

    private readonly _authService = inject(AuthService);
    private readonly _countryService = inject(CountryService);
    private readonly _cityService = inject(CityService);
    private readonly _formBuilder = inject(NonNullableFormBuilder);
    private readonly _router = inject(Router);

    readonly countries = this._countryService.getCountries();
    readonly cities = this._cityService.getCities();

    readonly alert: WritableSignal<{ type: FuseAlertType; message: string }> = signal({
        type: 'success',
        message: '',
    });
    readonly showAlert = signal(false);

    readonly signUpForm = this._formBuilder.group({
        cashierReference: ['', [Validators.required, Validators.min(1)]],
        cashierName: ['', Validators.required],
        cityCode: ['', Validators.required],
        countryCode: ['CM', Validators.required],
        agencyPhone: ['', Validators.required],
        rootPassword: ['', [Validators.required, Validators.pattern(STRONG_PASSWORD_REGEXP)]],
        rootPasswordConfirmation: ['', [Validators.required, Validators.pattern(STRONG_PASSWORD_REGEXP)]]
    }, {
        validators: FuseValidators.mustMatch('rootPassword', 'rootPasswordConfirmation')
    });
    readonly signUpFormChanges = toSignal(this.signUpForm.valueChanges, { initialValue: this.signUpForm.value });


    /**
     * Constructor
     */
    constructor() {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void {
        // Do nothing if the form is invalid
        if (this.signUpForm.invalid) {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert.set(false);

        // Sign up
        this._authService.signUp(this.signUpForm.getRawValue())
            .subscribe({
                next: () => this._router.navigateByUrl('/'),
                error: () => {
                    // Re-enable the form
                    this.signUpForm.enable();

                    // Set the alert
                    this.alert.set({
                        type: 'error',
                        message: 'Something went wrong, please try again.',
                    });

                    // Show the alert
                    this.showAlert.set(true);
                }
            });
    }
}
