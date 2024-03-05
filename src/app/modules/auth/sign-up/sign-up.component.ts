import { NgOptimizedImage } from '@angular/common';
import { Component, WritableSignal, signal, } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { STRONG_PASSWORD_REGEXP } from '@lerado/typescript-toolbox';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'sia-auth-sign-up',
    templateUrl: './sign-up.component.html',
    animations: fuseAnimations,
    standalone: true,
    imports: [RouterLink, FuseAlertComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule, NgOptimizedImage],
})
export class AuthSignUpComponent {

    alert: WritableSignal<{ type: FuseAlertType; message: string }> = signal({
        type: 'success',
        message: '',
    });

    signUpForm = this._formBuilder.group({
        cashierReference: ['', Validators.required],
        cashierName: ['', Validators.required],
        rootPassword: ['', [Validators.required, Validators.pattern(STRONG_PASSWORD_REGEXP)]],
        rootPasswordConfirmation: ['', [Validators.required, Validators.pattern(STRONG_PASSWORD_REGEXP)]]
    }, {
        validators: FuseValidators.mustMatch('rootPassword', 'rootPasswordConfirmation')
    });

    showAlert = signal(false);

    /**
     * Constructor
     */
    constructor(
        private readonly _authService: AuthService,
        private readonly _formBuilder: NonNullableFormBuilder,
        private readonly _router: Router
    ) {
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
